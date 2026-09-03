import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import { users, follows, blocks } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const usersRouter = router({
  // الحصول على بيانات المستخدم الحالي
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // الحصول على ملف شخصي
  getProfile: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return db.query.users.findFirst({
        where: eq(users.id, input.userId),
      });
    }),

  // تحديث الملف الشخصي
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      bio: z.string().max(500).optional(),
      specialization: z.string().optional(),
      level: z.enum(["Beginner", "Intermediate", "Expert"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.update(users).set(input).where(eq(users.id, ctx.userId));
      return { success: true };
    }),

  // متابعة مستخدم
  followUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.userId) {
        throw new Error("لا يمكن متابعة نفسك");
      }

      // التحقق من عدم وجود حظر
      const blocked = await db.query.blocks.findFirst({
        where: and(
          eq(blocks.blockerId, input.userId),
          eq(blocks.blockedId, ctx.userId)
        ),
      });

      if (blocked) {
        throw new Error("هذا المستخدم حظرك");
      }

      // إضافة المتابعة
      await db.insert(follows).values({
        followerId: ctx.userId,
        followingId: input.userId,
        isAccepted: true, // قبول فوري (يمكن تغييره إلى نظام طلب)
      });

      // تحديث عداد المتابعين
      await db.update(users).set({ followers: users.followers + 1 }).where(eq(users.id, input.userId));
      await db.update(users).set({ following: users.following + 1 }).where(eq(users.id, ctx.userId));

      return { success: true };
    }),

  // إلغاء المتابعة
  unfollowUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await db.delete(follows).where(
        and(eq(follows.followerId, ctx.userId), eq(follows.followingId, input.userId))
      );

      await db.update(users).set({ followers: users.followers - 1 }).where(eq(users.id, input.userId));
      await db.update(users).set({ following: users.following - 1 }).where(eq(users.id, ctx.userId));

      return { success: true };
    }),

  // حظر مستخدم
  blockUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(blocks).values({
        blockerId: ctx.userId,
        blockedId: input.userId,
      });
      return { success: true };
    }),
});