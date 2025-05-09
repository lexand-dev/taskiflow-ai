import { auth } from "@clerk/nextjs/server";
import { startCase } from "lodash";
import { OrganizationLayout } from "@/modules/organizations/ui/layouts/organization-layout";
import { SyncActiveOrganization } from "@/lib/sync-active-organization";

export async function generateMetadata() {
  const { orgSlug } = await auth();
  return {
    title: startCase(orgSlug || "Organization")
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SyncActiveOrganization />
      <OrganizationLayout>{children}</OrganizationLayout>
    </>
  );
};

export default OrganizationIdLayout;
