import { OrganizationProfile } from "@clerk/nextjs";

const SettingPage = () => {
  return (
    <div className="w-full">
      <OrganizationProfile
        routing="hash"
        appearance={{
          elements: {
            navbar: {
              background: "#fff"
            },
            cardBox: {
              boxShadow: "none",
              width: "100%"
            },
            card: {
              border: "1px solid #e5e5e5",
              boxShadow: "none",
              width: "100%"
            }
          }
        }}
      />
    </div>
  );
};

export default SettingPage;
