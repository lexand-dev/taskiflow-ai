import { db } from "@/db";
import { z } from "zod";
import { boards } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const boardsRouter = createTRPCRouter({
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
        image: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { orgId } = await auth();
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
          orgId,
          imageId,
          imageThumbUrl,
          imageFullUrl,
          imageLinkHTML,
          imageUserName
        })
        .returning();

      return data;
    })
});
