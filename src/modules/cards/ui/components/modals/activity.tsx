"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog } from "@/modules/activity/types";
import { ActivityItem } from "@/modules/activity/ui/components/activity-item";
import { ActivityIcon } from "lucide-react";

interface ActivityProps {
  items: AuditLog;
}

export const Activity = ({ items }: ActivityProps) => {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <ActivityIcon className="size-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="w-full">Activity</p>
        <ol className="mt-2 space-y-4">
          {items.map((item) => (
            <ActivityItem key={item.id} data={item} />
          ))}
        </ol>
      </div>
    </div>
  );
};

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="size-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-10 bg-neutral-200" />
      </div>
    </div>
  );
};
