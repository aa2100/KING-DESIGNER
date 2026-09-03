import { router } from "../_core/trpc";
import { postsRouter } from "./posts";
import { usersRouter } from "./users";
import { messagesRouter } from "./messages";

export const appRouter = router({
  posts: postsRouter,
  users: usersRouter,
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;