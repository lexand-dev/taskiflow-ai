import { PricingTable } from "@clerk/nextjs";

interface PageProps {
  params: Promise<{ organizationId: string }>;
}

const BillingPage = async ({ params }: PageProps) => {
  const { organizationId } = await params;
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      <PricingTable
        forOrganizations
        newSubscriptionRedirectUrl={`/organization/${organizationId}`}
      />
    </div>
  );
};

export default BillingPage;
