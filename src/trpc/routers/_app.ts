import { createTRPCRouter } from "../init";
import { listsRouter } from "@/modules/lists/server/procedures";
import { cardsRouter } from "@/modules/cards/server/procedures";
import { boardsRouter } from "@/modules/boards/server/procedures";

export const appRouter = createTRPCRouter({
  cards: cardsRouter,
  lists: listsRouter,
  boards: boardsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
