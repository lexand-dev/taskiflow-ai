"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { BoardNavbar } from "../components/board-navbar";
import { BoardSidebar } from "../components/board-sidebar";
import { ListContainer } from "@/modules/lists/ui/components/list-container";

interface BoardSectionProps {
  boardId: string;
}

export const BoardSection = ({ boardId }: BoardSectionProps) => {
  return (
    <Suspense fallback={<BoardSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <BoardSectionSuspense boardId={boardId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const BoardSectionSkeleton = () => {
  return (
    <div className="relative bg-cover bg-center bg-no-repeat h-full">
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">
        <div className="pt-28 h-full overflow-x-auto animate-pulse">
          <div className="h-6 w-1/2 bg-gray-300 rounded" />
        </div>
      </main>
    </div>
  );
};

export const BoardSectionSuspense = ({ boardId }: BoardSectionProps) => {
  const [board] = trpc.boards.getOne.useSuspenseQuery({
    id: boardId
  });
  const [lists] = trpc.lists.getMany.useSuspenseQuery({
    boardId
  });

  return (
    <main
      className="relative bg-cover bg-center bg-no-repeat h-full"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar boardId={board.id} />
      <BoardSidebar boardId={board.id} />
      <div className="flex-1 overflow-y-auto">
        <div className="absolute inset-0 bg-black/10" />
        <section className="relative pt-28 h-screen">
          <div className="p-4 h-full overflow-x-auto">
            <ListContainer data={lists} />
          </div>
        </section>
      </div>
    </main>
  );
};
