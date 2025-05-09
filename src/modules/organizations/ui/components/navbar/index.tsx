import Link from "next/link";
import { BrainCircuitIcon } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { MobileSidebar } from "../mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm flex items-center bg-background">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <BrainCircuitIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="hidden font-semibold sm:inline-block">
              Taskiflow AI
            </span>
          </Link>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            variables: { colorPrimary: "blue" },
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                backgroundColor:
                  "color-mix(in oklab, var(--color-violet-700) 10%, transparent)"
              },
              organizationPreviewMainIdentifier: {
                borderRadius: "0.375rem",
                border: "1px solid transparent",
                fontWeight: 500,
                color:
                  "color-mix(in oklab, var(--color-violet-600) 100%, transparent)"
              }
            }
          }}
        />
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30
              }
            }
          }}
        />
      </div>
    </nav>
  );
};
