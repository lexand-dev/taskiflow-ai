import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { HydrateClient, trpc } from "@/trpc/server";

import { BoardView } from "@/modules/boards/ui/views/board-view";

export const dynamic = "force-dynamic";

interface BoardIdPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { boardId } = await params;
  const { orgId } = await auth();

  void trpc.boards.getOne.prefetch({
    id: boardId
  });

  if (!orgId) {
    redirect("/select-org");
  }

  return (
    <HydrateClient>
      <BoardView boardId={boardId} />
    </HydrateClient>
  );
};

export default BoardIdPage;
