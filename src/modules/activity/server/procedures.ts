import { z } from "zod";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { auditLogs } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const auditLogsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        orgId: z.string()
      })
    )
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.orgId, input.orgId))
        .orderBy(desc(auditLogs.createdAt));

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return data;
    })
});
