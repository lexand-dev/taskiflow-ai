"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { trpc } from "@/trpc/client";
import { Description } from "./description";
import { Header } from "./header";
import { Actions } from "./action";
import { ICard } from "@/modules/cards/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
/* import { ErrorBoundary } from "react-error-boundary"; */

interface CardModalProps {
  task: ICard;
  isOpen: boolean;
  onClose: () => void;
}

export const CardModal = ({ task, isOpen, onClose }: CardModalProps) => {
  const [activeTab, setActiveTab] = useState("details");
  if (!task) {
    return null;
  }

  const [cardData] = trpc.cards.getOne.useSuspenseQuery({
    id: task.id
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 pt-2">
          <div className="md:col-span-2">
            <Tabs
              defaultValue="details"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div>
                  {!cardData ? (
                    <Description.Skeleton />
                  ) : (
                    <Description data={cardData} />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="activity" className="space-y-4">
                <div className="flex flex-col gap-y-2">
                  <p className="text-sm text-muted-foreground">
                    No activity yet
                  </p>
                </div>
                {/* Aquí iría el componente Activity si lo necesitas */}
              </TabsContent>
            </Tabs>
          </div>
          <Actions data={cardData} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CardModalSkeleton = () => {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <div className="w-full space-y-6">
          <DialogHeader>
            <DialogTitle className="text-center text-black/80">
              <Header.Skeleton />
            </DialogTitle>
          </DialogHeader>
          <Description.Skeleton />
          {/*   <Activity.Skeleton /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
