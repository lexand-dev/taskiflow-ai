"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ActivityItem } from "./activity-item";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AuditLogProps {
  orgId: string;
}

export const ActivityList = ({ orgId }: AuditLogProps) => {
  return (
    <Suspense fallback={<ActivityListSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ActivityListSuspense orgId={orgId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ActivityListSkeleton = () => {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[75%] h-14" />
    </ol>
  );
};

export const ActivityListSuspense = ({ orgId }: AuditLogProps) => {
  const [auditLogs] = trpc.auditLog.getMany.useSuspenseQuery({
    orgId
  });

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization.
      </p>
      {auditLogs.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  );
};
