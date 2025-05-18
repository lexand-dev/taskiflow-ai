import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <img className="size-6 text-primary" src="/logo.svg" />
          </div>
          <span className="hidden font-semibold sm:inline-block">
            Taskiflow AI
          </span>
        </Link>
        <p className="hidden md:block text-xs pl-20">
          Made by Lexand-dev Moviendo las manitas ♥
        </p>
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">
            Terms of Service
          </Button>
        </div>
      </div>
    </div>
  );
};
