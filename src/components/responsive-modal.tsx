import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  title?: string;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({
  children,
  open,
  title,
  onOpenChange
}: ResponsiveModalProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">{title}</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-black/80">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
