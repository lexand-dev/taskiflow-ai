import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: [
    {
      path: "../../../public/font.woff2"
    }
  ]
});

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gradient-bg">
      <div className="flex items-center justify-center pb-8 text-center">
        <div
          className={cn(
            "flex items-center justify-center flex-col",
            headingFont.className
          )}
        >
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Welcome to Taskiflow
          </h1>
          <p className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
            Your all-in-one project management solution.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ClerkLayout;
