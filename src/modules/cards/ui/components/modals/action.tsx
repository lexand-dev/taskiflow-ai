"use client";

import { toast } from "sonner";
import { Copy, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import { trpc } from "@/trpc/client";
import { ICard } from "@/modules/cards/types";

interface ActionsProps {
  data: ICard;
  onClose: () => void;
}

export const Actions = ({ data, onClose }: ActionsProps) => {
  const utils = trpc.useUtils();

  const copy = trpc.cards.copy.useMutation({
    onSuccess: (data) => {
      utils.lists.getMany.invalidate();
      onClose();
      toast.success(`Card ${data.title} copied.`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to copy card.");
    }
  });

  const deleteCard = trpc.cards.delete.useMutation({
    onSuccess: (data) => {
      utils.lists.getMany.invalidate();
      onClose();
      toast.success(`Card ${data.title} deleted.`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete card.");
    }
  });

  const onCopy = () => {
    copy.mutate({ id: data.id });
  };

  const onDelete = () => {
    deleteCard.mutate({ id: data.id });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-sm font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={copy.isPending}
        size="inline"
        variant="outline"
        className="w-full justify-start p-2"
      >
        <Copy className="size-4 mr-2 ml-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={deleteCard.isPending}
        size="inline"
        variant="outline"
        className="w-full justify-start p-2"
      >
        <Trash className="size-4 mr-2 ml-2" />
        Delete
      </Button>
    </div>
  );
};
