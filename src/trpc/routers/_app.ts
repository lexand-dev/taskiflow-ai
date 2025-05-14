import { boardsRouter } from "@/modules/boards/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  boards: boardsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
