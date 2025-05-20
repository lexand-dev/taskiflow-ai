import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { orgLimit } from "@/db/schema";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const incrementAvailableCount = async () => {
  const { orgId } = await auth();
  if (!orgId) {
    return;
  }

  const [orgCount] = await db
    .select()
    .from(orgLimit)
    .where(eq(orgLimit.orgId, orgId));

  if (orgCount) {
    await db
      .update(orgLimit)
      .set({ limit: orgCount.limit + 1 })
      .where(eq(orgLimit.orgId, orgId));
  } else {
    await db.insert(orgLimit).values({
      orgId,
      limit: 1
    });
  }
};

export const decreaseAvailableCount = async () => {
  const { orgId } = await auth();
  if (!orgId) {
    return;
  }

  const [orgCount] = await db
    .select()
    .from(orgLimit)
    .where(eq(orgLimit.orgId, orgId));

  if (orgCount) {
    await db
      .update(orgLimit)
      .set({ limit: orgCount.limit > 0 ? orgCount.limit - 1 : 0 })
      .where(eq(orgLimit.orgId, orgId));
  } else {
    await db.insert(orgLimit).values({
      orgId,
      limit: 1
    });
  }
};

export const checkAvailableCount = async () => {
  const { orgId } = await auth();
  if (!orgId) {
    return;
  }

  const [orgCount] = await db
    .select()
    .from(orgLimit)
    .where(eq(orgLimit.orgId, orgId));

  if (!orgCount || orgCount.limit < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

export const getAvailableCount = async () => {
  const { orgId } = await auth();
  if (!orgId) {
    return 0;
  }

  const [orgCount] = await db
    .select()
    .from(orgLimit)
    .where(eq(orgLimit.orgId, orgId));

  if (!orgCount) {
    return 0;
  }

  return orgCount.limit;
};
