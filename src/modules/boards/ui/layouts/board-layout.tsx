import { SidebarProvider } from "@/components/ui/sidebar";

interface StudioLayoutProps {
  children: React.ReactNode;
}

export const BoardLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">{children}</div>
    </SidebarProvider>
  );
};
