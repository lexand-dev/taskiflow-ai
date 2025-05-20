import { format } from "date-fns";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateLogMessage } from "@/lib/generate-log-message";
import { AuditLog } from "../../types";

interface ActivityItemProps {
  data: AuditLog[number];
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="size-8">
        <AvatarImage src={data.userImage ?? undefined} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase dark:text-neutral-300 text-neutral-700">
            {data.userName}
          </span>{" "}
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};
