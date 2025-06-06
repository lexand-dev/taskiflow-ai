import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const Navbar = async () => {
  const { orgId } = await auth();

  if (orgId) {
    redirect("/select-org");
  }
  return (
    <div className="fixed top-0 w-full h-14 px-4 shadow-sm border-b flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link prefetch href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <img className="size-6 text-primary" src="/logo.svg" />
          </div>
          <span className="hidden font-semibold sm:inline-block">
            Taskiflow AI
          </span>
        </Link>
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <div className="flex items-center justify-center space-x-2">
            <Button size="sm" variant="outline" asChild>
              <Link prefetch href="/sign-in">
                Login
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link prefetch href="/sign-up" className="text-white">
                Get Taskiflow for free
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};
