import { auditLogs } from "@/db/schema";

export const generateLogMessage = (log: typeof auditLogs.$inferSelect) => {
  const { action: currentAction, entityTitle, entityType } = log;

  switch (currentAction) {
    case "CREATE":
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case "UPDATE":
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case "DELETE":
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  }
};
