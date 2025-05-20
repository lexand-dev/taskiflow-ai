import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { workflow } from "@/lib/workflow";
import { and, desc, eq } from "drizzle-orm";
import { boards, boardUpdateSchema } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { ACTION, createAuditLog, ENTITY_TYPE } from "@/lib/create-audit-log";
import {
  incrementAvailableCount,
  checkAvailableCount,
  decreaseAvailableCount
} from "@/lib/org-limit";

export const boardsRouter = createTRPCRouter({
  generateTitle: protectedProcedure
    .input(z.object({ boardId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/board/workflows/title`,
        body: { boardId: input.boardId }
      });

      return workflowRunId;
    }),
  generateDescription: protectedProcedure
    .input(z.object({ boardId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/board/workflows/description`,
        body: { boardId: input.boardId }
      });
      console.log("Workflow triggered with ID:", workflowRunId);

      return workflowRunId;
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input }) => {
      const { orgId } = await auth();

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [data] = await db
        .select()
        .from(boards)
        .where(eq(boards.id, input.id));

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return data;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        orgId: z.string()
      })
    )
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(boards)
        .where(eq(boards.orgId, input.orgId))
        .orderBy(desc(boards.createdAt));

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return data;
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        image: z.string(),
        description: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();

      if (!orgId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "User must be associated with an organization to create a board."
        });
      }

      const canCreate = await checkAvailableCount();

      if (!canCreate) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You have reached your limit of free boards. Please upgrade to a paid plan to create more."
        });
      }

      const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
      ] = input.image.split("|");
      console.log(input.image);

      if (
        !imageId ||
        !imageThumbUrl ||
        !imageFullUrl ||
        !imageLinkHTML ||
        !imageUserName
      ) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [data] = await db
        .insert(boards)
        .values({
          title: input.title,
          description: input.description,
          orgId,
          imageId,
          imageThumbUrl,
          imageFullUrl,
          imageLinkHTML,
          imageUserName
        })
        .returning();

      await incrementAvailableCount();

      await createAuditLog({
        entityId: data.id,
        entityTitle: data.title,
        entityType: ENTITY_TYPE.BOARD,
        action: ACTION.CREATE
      });

      return data;
    }),
  update: protectedProcedure
    .input(boardUpdateSchema)
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
      const {
        id,
        title,
        description,
        updatedAt,
        imageFullUrl,
        imageId,
        imageLinkHTML,
        imageThumbUrl,
        imageUserName
      } = input;

      if (!orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Board ID is required"
        });
      }

      const [updateBoard] = await db
        .update(boards)
        .set({
          title,
          description,
          updatedAt,
          imageFullUrl,
          imageId,
          imageLinkHTML,
          imageThumbUrl,
          imageUserName
        })
        .where(and(eq(boards.id, id), eq(boards.orgId, orgId)))
        .returning();

      await createAuditLog({
        entityTitle: updateBoard.title,
        entityId: updateBoard.id,
        entityType: ENTITY_TYPE.BOARD,
        action: ACTION.UPDATE
      });

      if (!updateBoard) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updateBoard;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        boardId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
      const { boardId } = input;

      if (!orgId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [deleteBoard] = await db
        .delete(boards)
        .where(and(eq(boards.id, boardId), eq(boards.orgId, orgId)))
        .returning();

      await decreaseAvailableCount();

      await createAuditLog({
        entityId: deleteBoard.id,
        entityTitle: deleteBoard.title,
        entityType: ENTITY_TYPE.BOARD,
        action: ACTION.DELETE
      });

      if (!deleteBoard) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deleteBoard;
    })
});
