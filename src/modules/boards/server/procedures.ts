import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { boards, boardUpdateSchema } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const boardsRouter = createTRPCRouter({
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

      if (!deleteBoard) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return deleteBoard;
    })
});
