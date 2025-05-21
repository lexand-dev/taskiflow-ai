import Link from "next/link";
import Image from "next/image";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";

interface ProModalProps {
  orgId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}

export const ProModal = ({
  onOpenChange,
  open,
  orgId,
  title
}: ProModalProps) => {
  return (
    <ResponsiveModal open={open} title={title} onOpenChange={onOpenChange}>
      <div className="aspect-video relative flex items-center justify-center">
        <Image src="/hero.svg" alt="Hero" className="object-cover" fill />
      </div>
      <div className="text-neutral-700 dark:text-neutral-300 mx-auto space-y-6 p-6">
        <h2 className="font-semibold text-xl">
          Upgrade to Taskiflow Pro Today!
        </h2>
        <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          Explore the best of Taskiflow
        </p>
        <div className="pl-3">
          <ul className="text-sm list-disc">
            <li>Unlimited boards</li>
            <li>Advanced checklists</li>
            <li>Admin and security features</li>
            <li>And more!</li>
          </ul>
        </div>
        <Button className="text-white/80">
          <Link prefetch href={`/organization/${orgId}/billing`}>
            Upgrade
          </Link>
        </Button>
      </div>
    </ResponsiveModal>
  );
};
