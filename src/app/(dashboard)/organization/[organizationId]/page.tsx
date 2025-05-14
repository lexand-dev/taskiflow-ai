import { BoardView } from "@/modules/boards/ui/views/board-view";

import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ organizationId: string }>;
}

const OrganizationIdPage = async ({ params }: PageProps) => {
  const { organizationId } = await params;
  void trpc.boards.getMany.prefetch({
    orgId: organizationId
  });
  return (
    <HydrateClient>
      <BoardView organizationId={organizationId} />
    </HydrateClient>
  );
};

export default OrganizationIdPage;
