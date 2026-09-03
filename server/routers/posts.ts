import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import { posts, postMedia, likes, comments, users, notifications } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const postsRouter = router({
  // الحصول على Feed
  getFeed: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input, ctx }) => {
      // جميع المنشورات العامة مع بيانات المالك الفعلية من قاعدة البيانات
      const result = await db.query.posts.findMany({
        where: eq(posts.isPublished, true),
        orderBy: desc(posts.createdAt),
        limit: input.limit,
        offset: input.offset,
        with: {
          user: true,
          media: true,
        },
      });
      return result;
    }),

  // إنشاء منشور
  createPost: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.string().optional(),
      isPrivate: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      const result = await db.insert(posts).values({
        userId: ctx.userId,
        title: input.title,
        description: input.description,
        category: input.category,
        isPrivate: input.isPrivate,
      });
      return result;
    }),

  // الإعجاب بمنشور
  likePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // التحقق من عدم وجود إعجاب مسبق
      const existing = await db.query.likes.findFirst({
        where: and(eq(likes.userId, ctx.userId), eq(likes.postId, input.postId)),
      });

      if (existing) {
        throw new Error("لقد أعجبت بهذا المنشور بالفعل");
      }

      // إضافة الإعجاب
      await db.insert(likes).values({ userId: ctx.userId, postId: input.postId });

      // تحديث عداد الإعجابات
      await db.update(posts).set({ likesCount: posts.likesCount + 1 }).where(eq(posts.id, input.postId));

      // إرسال إشعار
      const post = await db.query.posts.findFirst({ where: eq(posts.id, input.postId) });
      if (post && post.userId !== ctx.userId) {
        await db.insert(notifications).values({
          userId: post.userId,
          type: "like",
          triggerUserId: ctx.userId,
          postId: input.postId,
        });
      }

      return { success: true };
    }),

  // إلغاء الإعجاب
  unlikePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await db.query.likes.findFirst({
        where: and(eq(likes.userId, ctx.userId), eq(likes.postId, input.postId)),
      });

      if (!existing) {
        throw new Error("لم تعجب بهذا المنشور");
      }

      await db.delete(likes).where(and(eq(likes.userId, ctx.userId), eq(likes.postId, input.postId)));
      await db.update(posts).set({ likesCount: posts.likesCount - 1 }).where(eq(posts.id, input.postId));

      return { success: true };
    }),

  // التعليق على منشور
  addComment: protectedProcedure
    .input(z.object({ postId: z.number(), content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(comments).values({
        userId: ctx.userId,
        postId: input.postId,
        content: input.content,
      });

      await db.update(posts).set({ commentsCount: posts.commentsCount + 1 }).where(eq(posts.id, input.postId));

      // إشعار
      const post = await db.query.posts.findFirst({ where: eq(posts.id, input.postId) });
      if (post && post.userId !== ctx.userId) {
        await db.insert(notifications).values({
          userId: post.userId,
          type: "comment",
          triggerUserId: ctx.userId,
          postId: input.postId,
        });
      }

      return { success: true };
    }),

  // مشاركة منشور
  sharePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await db.update(posts).set({ sharesCount: posts.sharesCount + 1 }).where(eq(posts.id, input.postId));
      return { success: true };
    }),
});