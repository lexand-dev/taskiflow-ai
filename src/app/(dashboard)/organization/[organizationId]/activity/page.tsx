import { HydrateClient, trpc } from "@/trpc/server";
import { ActivityList } from "@/modules/activity/ui/components/activity-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ organizationId: string }>;
}

const ActivityPage = async ({ params }: PageProps) => {
  const { organizationId } = await params;
  void trpc.auditLog.getMany.prefetch({
    orgId: organizationId
  });

  return (
    <HydrateClient>
      <ActivityList orgId={organizationId} />
    </HydrateClient>
  );
};

export default ActivityPage;
