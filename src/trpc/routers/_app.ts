import { createTRPCRouter } from "../init";
import { orgLimitRouter } from "@/modules/orglimit/procedures";
import { listsRouter } from "@/modules/lists/server/procedures";
import { cardsRouter } from "@/modules/cards/server/procedures";
import { boardsRouter } from "@/modules/boards/server/procedures";
import { auditLogsRouter } from "@/modules/activity/server/procedures";

export const appRouter = createTRPCRouter({
  cards: cardsRouter,
  lists: listsRouter,
  boards: boardsRouter,
  orgLimit: orgLimitRouter,
  auditLog: auditLogsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
