"use client";

import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { ElementRef, KeyboardEventHandler, forwardRef, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { FormTextArea } from "@/modules/boards/ui/components/form-textarea";
import { FormSubmit } from "@/modules/boards/ui/components/form-submit";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const formRef = useRef<ElementRef<"form">>(null);
    const utils = trpc.useUtils();

    const create = trpc.cards.create.useMutation({
      onSuccess: (data) => {
        utils.lists.getMany.invalidate();
        toast.success(`Card ${data.title} created`);
        formRef.current?.reset();
      },
      onError: (error) => {
        console.error(error);
        toast.error("Something went wrong");
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

    const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;

      create.mutate({ title, listId });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextArea
            id="title"
            onKeyDown={onTextareakeyDown}
            ref={ref}
            placeholder="Enter a title for this card"
          />
          <input hidden id="listId" name="listId" value={listId} />
          <div className="flex items-cnter gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="size-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="px-2 pt-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          variant="ghost"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
