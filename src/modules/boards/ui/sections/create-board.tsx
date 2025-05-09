"use client";
import { HelpCircle } from "lucide-react";

import { Hint } from "../components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardCreateModal } from "../components/board-create-modal";

import { MAX_FREE_BOARDS } from "@/constants/boards";
import { useState } from "react";

export const CreateBoard = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <BoardCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div
        onClick={() => setCreateModalOpen(true)}
        role="button"
        className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
      >
        <p className="text-sm">Create new board</p>
        <span className="text-xs">{`${MAX_FREE_BOARDS} remaining`}</span>
        <Hint
          sideOffset={40}
          description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
        >
          <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
        </Hint>
      </div>
    </div>
  );
};

CreateBoard.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
