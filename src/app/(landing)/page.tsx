import Link from "next/link";
import { Medal } from "lucide-react";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const headingFont = localFont({
  src: [
    {
      path: "../../../public/font.woff2"
    }
  ]
});

const textFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

const MarketingPage = () => {
  return (
    <section className="w-full flex items-center justify-center flex-col">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div
          className={cn(
            "flex items-center justify-center flex-col",
            headingFont.className
          )}
        >
          <div className="mb-4 flex items-center justify-center border shadow-sm px-4 pb-2 pt-3  bg-purple-100 text-primary/80 rounded-full">
            <Medal className="w-5 h-5 mr-2" />
            No 1 Task Management App
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Centralize Your Project Management <br />
            <span className="text-primary">with</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              AI
            </span>{" "}
            <span className="italic">Features</span>
          </h1>
          <p
            className={cn(
              "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
              textFont.className
            )}
          >
            Transform your workflow with Taskiflow AI, the all-in-one project
            management solution that centralizes task tracking, resource
            allocation, and team collaboration.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-8">
          <Button size="lg" className="h-12 px-8">
            <Link href="/sign-up" className="text-white">
              Get Started for Free
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketingPage;
