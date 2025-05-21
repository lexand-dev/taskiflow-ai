import React from "react";

import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "../components/sidebar";
import { Separator } from "@/components/ui/separator";
import { InfoSection } from "../sections/info-section";

export const OrganizationLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { has } = await auth();
  const isPro = has({ plan: "pro" });

  return (
    <main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        <div className="w-full mb-20">
          <InfoSection isPro={isPro} />
          <Separator className="my-4" />
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
};
