import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { desc, eq, and, asc } from "drizzle-orm";
import { lists, listUpdateSchema, boards, cards } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";

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

      const [data] = await db.select().from(lists).where(eq(lists.id, id));

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
      const { boardId } = input;

      const result = await db.query.lists.findMany({
        where: eq(lists.boardId, boardId),
        with: {
          cards: {
            orderBy: [asc(cards.order)]
          }
        },
        orderBy: [asc(lists.order)]
      });

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

      await createAuditLog({
        entityId: list.id,
        entityTitle: list.title,
        entityType: ENTITY_TYPE.LIST,
        action: ACTION.CREATE
      });

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

      await createAuditLog({
        entityId: updateList.id,
        entityTitle: updateList.title,
        entityType: ENTITY_TYPE.LIST,
        action: ACTION.UPDATE
      });

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

      await createAuditLog({
        entityId: deleteList.id,
        entityTitle: deleteList.title,
        entityType: ENTITY_TYPE.LIST,
        action: ACTION.DELETE
      });

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
            boardId: z.string()
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
          .where(and(eq(lists.id, item.id), eq(lists.boardId, item.boardId)))
      );

      await Promise.all(transaction);
      return items;
    }),
  copy: protectedProcedure
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

      const listToCopy = await db.query.lists.findFirst({
        where: and(eq(lists.id, id), eq(lists.boardId, boardId)),
        with: {
          cards: true
        }
      });

      if (!listToCopy) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [lastList] = await db
        .select({ order: lists.order })
        .from(lists)
        .where(eq(lists.boardId, boardId))
        .orderBy(desc(lists.order));

      const newOrder = lastList ? lastList.order + 1 : 1;

      const [list] = await db
        .insert(lists)
        .values({
          boardId: listToCopy.boardId,
          title: `${listToCopy.title} (copy)`,
          order: newOrder
        })
        .returning();

      const newcards = await Promise.all(
        listToCopy.cards.map((card) => {
          return db
            .insert(cards)
            .values({
              title: card.title,
              description: card.description,
              order: card.order,
              listId: list.id
            })
            .returning()
            .then((data) => data[0]);
        })
      );

      const newList = {
        ...list,
        cards: newcards
      };

      await createAuditLog({
        entityId: newList.id,
        entityTitle: newList.title,
        entityType: ENTITY_TYPE.LIST,
        action: ACTION.CREATE
      });

      return newList;
    })
});
