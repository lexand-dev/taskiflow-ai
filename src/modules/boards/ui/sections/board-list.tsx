"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelpCircle, PlusIcon, User2 } from "lucide-react";

import { trpc } from "@/trpc/client";
import { Hint } from "../components/hint";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { BoardCreateModal } from "../components/board-create-modal";

interface BoardListProps {
  organizationId: string;
}

export const BoardList = ({ organizationId }: BoardListProps) => {
  return (
    <Suspense fallback={<BoardListSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <BoardListSuspense organizationId={organizationId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const BoardListSuspense = ({ organizationId }: BoardListProps) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [boards] = trpc.boards.getMany.useSuspenseQuery({
    orgId: organizationId
  });

  return (
    <div className="space-y-4">
      <BoardCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className="flex items-center font-semibold text-lg dark:text-neutral-300">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 p-2 bg-black/30 group-hover:bg-black/40 transition">
              <p className="relative font-semibold text-white">{board.title}</p>
            </div>
          </Link>
        ))}
        <Card className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
          <p className="text-sm">Create new board</p>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusIcon />
          </Button>
          <span className="text-xs">{`${MAX_FREE_BOARDS} remaining`}</span>
          <Hint
            sideOffset={40}
            description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
          >
            <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
          </Hint>
        </Card>
      </div>
    </div>
  );
};

const BoardListSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
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
    </div>
  );
};
