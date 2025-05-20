import { auth, currentUser } from "@clerk/nextjs/server";

import { db } from "@/db";
import { action, auditLogs, entityType } from "@/db/schema";

export type ActionType = (typeof action.enumValues)[number]; // Esto da "CREATE" | "UPDATE" | "DELETE"
export type EntityType = (typeof entityType.enumValues)[number]; // Esto da "BOARD" | "LIST" | "CARD"

export const ACTION = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE"
} as const;

export const ENTITY_TYPE = {
  BOARD: "BOARD",
  LIST: "LIST",
  CARD: "CARD"
} as const;

interface Props {
  entityId: string;
  entityType: EntityType;
  entityTitle: string;
  action: ActionType;
}

export async function createAuditLog({
  entityId,
  entityType,
  entityTitle,
  action
}: Props) {
  try {
    const { orgId } = await auth();
    const user = await currentUser();

    if (!user || !orgId) {
      throw new Error("User not found");
    }

    await db.insert(auditLogs).values({
      orgId,
      entityId,
      entityType,
      entityTitle,
      action,
      userId: user.id,
      userImage: user?.imageUrl,
      userName: user?.firstName + " " + user?.lastName
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
}
