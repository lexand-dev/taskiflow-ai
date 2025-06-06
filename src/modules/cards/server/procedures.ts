import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { desc, eq, asc, and } from "drizzle-orm";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";
import { lists, cards, cardUpdateSchema, auditLogs } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const cardsRouter = createTRPCRouter({
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

      const [data] = await db.select().from(cards).where(eq(cards.id, id));

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
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

      const listsWithCards = await db
        .select()
        .from(lists)
        .where(eq(lists.boardId, boardId))
        .orderBy(asc(lists.order));

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
        listId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();

      if (!orgId) {
        throw new TRPCError({
          code: "UNAUTHORIZED"
        });
      }

      const [listExists] = await db
        .select({ id: lists.id })
        .from(lists)
        .where(eq(lists.id, input.listId));

      if (!listExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "List not found"
        });
      }

      const [lastCard] = await db
        .select({ order: cards.order })
        .from(cards)
        .where(eq(cards.listId, input.listId))
        .orderBy(desc(cards.order));

      const newOrder = lastCard ? lastCard.order + 1 : 1;

      const [newCard] = await db
        .insert(cards)
        .values({
          title: input.title,
          listId: input.listId,
          order: newOrder
        })
        .returning();

      await createAuditLog({
        entityId: newCard.id,
        entityTitle: newCard.title,
        entityType: ENTITY_TYPE.CARD,
        action: ACTION.CREATE
      });

      return newCard;
    }),
  update: protectedProcedure
    .input(cardUpdateSchema)
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
      const { id, ...updateData } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Card ID is required"
        });
      }

      const [updatedCard] = await db
        .update(cards)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(cards.id, id))
        .returning();

      await createAuditLog({
        entityId: updatedCard.id,
        entityTitle: updatedCard.title,
        entityType: ENTITY_TYPE.CARD,
        action: ACTION.UPDATE
      });

      if (!updatedCard) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
      }

      return updatedCard;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
      const { id } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [deletedCard] = await db
        .delete(cards)
        .where(eq(cards.id, id))
        .returning();

      await createAuditLog({
        entityId: deletedCard.id,
        entityTitle: deletedCard.title,
        entityType: ENTITY_TYPE.CARD,
        action: ACTION.DELETE
      });

      if (!deletedCard) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
      }

      return deletedCard;
    }),
  updateCardOrder: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            order: z.number(),
            listId: z.string(),
            title: z.string().optional()
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
          .update(cards)
          .set({
            order: item.order,
            listId: item.listId
          })
          .where(eq(cards.id, item.id))
      );

      await Promise.all(transaction);
      return items;
    }),
  copy: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
      const { id } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [cardToCopy] = await db
        .select()
        .from(cards)
        .where(eq(cards.id, id));

      if (!cardToCopy) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
      }

      const [lastCard] = await db
        .select({ order: cards.order })
        .from(cards)
        .where(eq(cards.listId, cardToCopy.listId))
        .orderBy(desc(cards.order))
        .limit(1);

      const newOrder = lastCard ? lastCard.order + 1 : 1;

      const [newCard] = await db
        .insert(cards)
        .values({
          title: `${cardToCopy.title} - Copy`,
          description: cardToCopy.description,
          order: newOrder,
          listId: cardToCopy.listId
        })
        .returning();

      await createAuditLog({
        entityId: newCard.id,
        entityTitle: newCard.title,
        entityType: ENTITY_TYPE.CARD,
        action: ACTION.CREATE
      });

      return newCard;
    }),
  logs: protectedProcedure
    .input(
      z.object({
        cardId: z.string()
      })
    )
    .query(async ({ input }) => {
      const { orgId } = await auth();
      const { cardId } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const logs = await db
        .select()
        .from(auditLogs)
        .where(
          and(
            eq(auditLogs.entityId, cardId),
            eq(auditLogs.orgId, orgId),
            eq(auditLogs.entityType, "CARD")
          )
        )
        .orderBy(desc(auditLogs.createdAt))
        .limit(3);

      if (!logs) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
      }

      return logs;
    })
});
