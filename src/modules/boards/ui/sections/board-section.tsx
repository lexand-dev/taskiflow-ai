"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { BoardNavbar } from "../components/board-navbar";
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
          <div className="flex items-center justify-between px-4">
            <div className="w-1/2 h-8 bg-gray-300 rounded" />
            <div className="w-1/4 h-8 bg-gray-300 rounded" />
          </div>
          <div className="py-4 px-1 h-full overflow-x-auto">
            <div className="flex gap-x-3 h-full">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-[272px] shrink-0">
                  <div className="h-8 bg-gray-300 rounded mb-2" />
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-10 bg-gray-300 rounded mb-2" />
                  ))}
                </div>
              ))}
            </div>
          </div>
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
      <div className="flex-1 overflow-y-auto">
        <div className="absolute inset-0 bg-black/10" />
        <section className="relative pt-28 h-screen">
          <div className="py-4 px-1 h-full overflow-x-auto">
            <ListContainer data={lists} boardId={board.id} />
          </div>
        </section>
      </div>
    </main>
  );
};
