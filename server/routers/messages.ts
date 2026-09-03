import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import { messages, notifications } from "../../drizzle/schema";
import { eq, and, or, desc } from "drizzle-orm";

export const messagesRouter = router({
  // إرسال رسالة
  sendMessage: protectedProcedure
    .input(z.object({
      recipientId: z.number(),
      content: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const result = await db.insert(messages).values({
        senderId: ctx.userId,
        recipientId: input.recipientId,
        content: input.content,
        status: "delivered",
      });

      // إشعار
      await db.insert(notifications).values({
        userId: input.recipientId,
        type: "message",
        triggerUserId: ctx.userId,
      });

      return { success: true, messageId: result.insertId };
    }),

  // الحصول على المحادثات
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    // آخر رسالة في كل محادثة
    return db.query.messages.findMany({
      where: or(eq(messages.senderId, ctx.userId), eq(messages.recipientId, ctx.userId)),
      orderBy: desc(messages.createdAt),
      limit: 20,
    });
  }),

  // الحصول على الرسائل مع مستخدم معين
  getMessages: protectedProcedure
    .input(z.object({ userId: z.number(), limit: z.number().default(20) }))
    .query(async ({ input, ctx }) => {
      return db.query.messages.findMany({
        where: or(
          and(eq(messages.senderId, ctx.userId), eq(messages.recipientId, input.userId)),
          and(eq(messages.senderId, input.userId), eq(messages.recipientId, ctx.userId))
        ),
        orderBy: desc(messages.createdAt),
        limit: input.limit,
      });
    }),

  // وضع علامة على الرسائل كمقروءة
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await db.update(messages)
        .set({ isRead: true, status: "read", readAt: new Date() })
        .where(eq(messages.id, input.messageId));
      return { success: true };
    }),
});