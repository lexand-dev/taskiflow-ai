import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getAvailableCount } from "@/lib/org-limit"; // Path to your existing file

export const orgLimitRouter = createTRPCRouter({
  getCount: protectedProcedure.query(async () => {
    return await getAvailableCount();
  })
});
