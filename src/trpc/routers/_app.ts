import { createTRPCRouter } from "../init";
import { listsRouter } from "@/modules/lists/server/procedures";
import { boardsRouter } from "@/modules/boards/server/procedures";

export const appRouter = createTRPCRouter({
  boards: boardsRouter,
  lists: listsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
