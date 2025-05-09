"use client";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const headingFont = localFont({
  src: [
    {
      path: "../../../public/font.woff2"
    }
  ]
});

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="h-screen flex flex-col items-center gradient-bg pt-10">
      <div className="flex items-center text-center">
        <div
          className={cn(
            "flex items-center justify-center flex-col",
            headingFont.className
          )}
        >
          {pathname === "/select-org" ? (
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Select an Organization
            </h1>
          ) : (
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to Taskiflow
            </h1>
          )}

          <p className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto pb-24">
            Your all-in-one project management solution.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ClerkLayout;
