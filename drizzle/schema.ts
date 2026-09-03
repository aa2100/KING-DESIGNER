import { int, mysqlTable, text, timestamp, varchar, boolean, json, mysqlEnum, decimal, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// المستخدمون
export const users = mysqlTable("users", {
  id: int().primaryKey().autoincrement(),
  email: varchar(255).unique().notNull(),
  name: varchar(255).notNull(),
  handle: varchar(50).unique().notNull(), // @username - فريد
  publicId: varchar(20).unique().notNull(), // king_XXXX - فريد للمشاركة
  bio: text(),
  country: varchar(100),
  specialization: varchar(100),
  level: mysqlEnum("Beginner", "Intermediate", "Expert").default("Beginner"),
  isVerified: boolean().default(false),
  profileImage: varchar(500),
  coverImage: varchar(500),
  credits: int().default(0), // الرصيد الفعلي
  dailyReward: int().default(50), // المكافأة اليومية
  lastRewardDate: timestamp(),
  isAdmin: boolean().default(false),
  isBanned: boolean().default(false),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
  lastSeen: timestamp().default(sql`CURRENT_TIMESTAMP`),
  followers: int().default(0), // عداد فعلي
  following: int().default(0), // عداد فعلي
  postsCount: int().default(0), // عداد فعلي
}, (table) => [{
  emailIdx: index("email_idx").on(table.email),
  handleIdx: index("handle_idx").on(table.handle),
  publicIdIdx: index("publicId_idx").on(table.publicId),
}]);

// المنشورات
export const posts = mysqlTable("posts", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull(),
  title: varchar(255).notNull(),
  description: text().notNull(),
  category: varchar(100),
  isPrivate: boolean().default(false),
  isPublished: boolean().default(true),
  likesCount: int().default(0), // عداد فعلي
  commentsCount: int().default(0), // عداد فعلي
  sharesCount: int().default(0), // عداد فعلي
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  userIdIdx: index("userId_idx").on(table.userId),
  createdAtIdx: index("createdAt_idx").on(table.createdAt),
}]);

// وسائط المنشورات
export const postMedia = mysqlTable("post_media", {
  id: int().primaryKey().autoincrement(),
  postId: int().notNull(),
  url: varchar(500).notNull(),
  type: mysqlEnum("image", "video").default("image"),
  size: int(),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
});

// الإعجابات
export const likes = mysqlTable("likes", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull(),
  postId: int().notNull(),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  uniqueUserPost: sql`UNIQUE (userId, postId)`, // منع الإعجاب المكرر
}]);

// التعليقات
export const comments = mysqlTable("comments", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull(),
  postId: int().notNull(),
  content: text().notNull(),
  mentionedUsers: json().default('[]'), // @mentions
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  postIdIdx: index("postId_idx").on(table.postId),
}]);

// الردود على التعليقات
export const replies = mysqlTable("replies", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull(),
  commentId: int().notNull(),
  content: text().notNull(),
  mentionedUsers: json().default('[]'),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
});

// المتابعات
export const follows = mysqlTable("follows", {
  id: int().primaryKey().autoincrement(),
  followerId: int().notNull(),
  followingId: int().notNull(),
  isAccepted: boolean().default(false),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  uniqueFollow: sql`UNIQUE (followerId, followingId)`,
}]);

// الحظر
export const blocks = mysqlTable("blocks", {
  id: int().primaryKey().autoincrement(),
  blockerId: int().notNull(),
  blockedId: int().notNull(),
  reason: text(),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  uniqueBlock: sql`UNIQUE (blockerId, blockedId)`,
}]);

// الرسائل
export const messages = mysqlTable("messages", {
  id: int().primaryKey().autoincrement(),
  senderId: int().notNull(),
  recipientId: int().notNull(),
  content: text().notNull(),
  mediaUrl: varchar(500),
  isRead: boolean().default(false),
  readAt: timestamp(),
  status: mysqlEnum("sent", "delivered", "read").default("sent"),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  senderIdx: index("senderId_idx").on(table.senderId),
  recipientIdx: index("recipientId_idx").on(table.recipientId),
}]);

// الإشعارات
export const notifications = mysqlTable("notifications", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull(),
  type: mysqlEnum("like", "comment", "follow", "message", "reply", "mention").notNull(),
  triggerUserId: int().notNull(),
  postId: int(),
  commentId: int(),
  isRead: boolean().default(false),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  userIdIdx: index("userId_idx").on(table.userId),
}]);

// المشاركات
export const shares = mysqlTable("shares", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull(),
  postId: int().notNull(),
  platform: varchar(50), // direct, twitter, facebook, etc
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
});

// سجل التدقيق (Audit Trail)
export const auditLog = mysqlTable("audit_log", {
  id: int().primaryKey().autoincrement(),
  userId: int(),
  action: varchar(255).notNull(),
  targetId: int(),
  targetType: varchar(50),
  details: json(),
  ipAddress: varchar(45),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  userIdIdx: index("userId_idx").on(table.userId),
}]);

// سجل المعاملات المالية
export const transactions = mysqlTable("transactions", {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull(),
  type: mysqlEnum("credit", "debit", "refund").notNull(),
  amount: int().notNull(),
  reason: varchar(255),
  status: mysqlEnum("pending", "completed", "failed").default("completed"),
  previousBalance: int(),
  newBalance: int(),
  createdAt: timestamp().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [{
  userIdIdx: index("userId_idx").on(table.userId),
}]);

// أنواع الحذف
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Follow = typeof follows.$inferSelect;