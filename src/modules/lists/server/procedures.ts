import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { desc, eq, and, asc } from "drizzle-orm";
import { lists, listUpdateSchema, boards, cards } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const listsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input }) => {
      const { orgId } = await auth();
      const { id } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [data] = await db
        .select()
        .from(lists)
        .where(eq(lists.id, id))
        .orderBy(desc(lists.order));

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return data;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        boardId: z.string()
      })
    )
    .query(async ({ input }) => {
      const { orgId } = await auth();
      const { boardId } = input;

      const listsWithCards = await db
        .select()
        .from(lists)
        .where(eq(lists.boardId, boardId))
        .orderBy(asc(lists.order));
      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      if (!listsWithCards) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const listss = listsWithCards.map((list) => ({
        ...list,
        cards: db
          .select()
          .from(cards)
          .where(eq(cards.listId, list.id))
          .orderBy(asc(cards.order))
          .then((cards) => cards)
      }));

      const result = await Promise.all(
        listss.map(async (list) => {
          const cards = await list.cards;
          return {
            ...list,
            cards: cards
          };
        })
      );

      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      console.log("lists", result);
      return result;
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        boardId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();

      if (!orgId) {
        throw new TRPCError({
          code: "UNAUTHORIZED"
        });
      }

      const [board] = await db
        .select()
        .from(boards)
        .where(and(eq(boards.id, input.boardId), eq(boards.orgId, orgId)));
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found"
        });
      }

      const [lastList] = await db
        .select({ order: lists.order })
        .from(lists)
        .where(eq(lists.boardId, input.boardId))
        .orderBy(desc(lists.order));

      const newOrder = lastList ? lastList.order + 1 : 1;

      const [list] = await db
        .insert(lists)
        .values({
          title: input.title,
          boardId: input.boardId,
          order: newOrder
        })
        .returning();

      return list;
    }),
  update: protectedProcedure
    .input(listUpdateSchema)
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
      const { id, title, order, boardId } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "List ID is required"
        });
      }

      const [updateList] = await db
        .update(lists)
        .set({
          title,
          order,
          boardId,
          updatedAt: new Date()
        })
        .where(eq(lists.id, id))
        .returning();

      if (!updateList) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updateList;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        boardId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
      const { id, boardId } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [deleteList] = await db
        .delete(lists)
        .where(and(eq(lists.id, id), eq(lists.boardId, boardId)))
        .returning();

      if (!deleteList) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deleteList;
    }),
  updateListOrder: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            order: z.number(),
            title: z.string().optional(),
            boardId: z.string().optional()
          })
        )
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
      const { items } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const transaction = items.map((item) =>
        db
          .update(lists)
          .set({
            order: item.order
          })
          .where(eq(lists.id, item.id))
      );

      await Promise.all(transaction);
      return items;
    })
});
