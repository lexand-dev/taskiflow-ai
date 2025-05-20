"use client";

import { toast } from "sonner";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { trpc } from "@/trpc/client";
import { ICard } from "@/modules/cards/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSubmit } from "@/modules/boards/ui/components/form-submit";
import { FormTextArea } from "@/modules/boards/ui/components/form-textarea";

interface DescriptionProps {
  data: ICard;
}

export const Description = ({ data }: DescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  const utils = trpc.useUtils();

  const update = trpc.cards.update.useMutation({
    onSuccess: () => {
      utils.lists.getMany.invalidate();
      utils.cards.getOne.invalidate({ id: data.id });
      utils.cards.logs.invalidate({ cardId: data.id });
      toast.success(`Card description updated`);
      disableEditing();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong");
    }
  });

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;

    update.mutate({
      id: data.id,
      description
    });
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">Description</h3>
      {isEditing ? (
        <form action={onSubmit} ref={formRef} className="space-y-2">
          <FormTextArea
            id="description"
            className="w-full mt-2"
            placeholder="Add a more detailed description"
            defaultValue={data.description || undefined}
            ref={textareaRef}
          />
          <div className="flex items-center gap-x-2">
            <FormSubmit>Save</FormSubmit>
            <Button
              type="button"
              onClick={disableEditing}
              size="sm"
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div
          onClick={enableEditing}
          role="button"
          className="min-h-[78px] text-sm font-medium py-3 px-3.5 rounded-md bg-input/30 hover:bg-input/40 transition-colors cursor-pointer"
        >
          {data.description || "Add a more detailed description..."}
        </div>
      )}
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-input/30" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-input/30" />
        <Skeleton className="w-full h-[78px] bg-input/30" />
      </div>
    </div>
  );
};
