"use client";

import { toast } from "sonner";
import { useState, useRef, ComponentRef } from "react";

import { trpc } from "@/trpc/client";
import { FormSubmit } from "./form-submit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon, SparklesIcon } from "lucide-react";

interface BoardDescriptionFormProps {
  boardId: string;
}

export const BoardDescriptionForm = ({
  boardId
}: BoardDescriptionFormProps) => {
  const formRef = useRef<ComponentRef<"form">>(null);
  const inputRef = useRef<ComponentRef<"textarea">>(null);

  const utils = trpc.useUtils();

  const [board] = trpc.boards.getOne.useSuspenseQuery({ id: boardId });

  const update = trpc.boards.update.useMutation({
    onSuccess: (data) => {
      toast.success(`Board description updated!`);
      setDescription(data.description || "");
      disableEditing();
      utils.boards.getOne.invalidate({ id: boardId });
    },
    onError: () => {
      toast.error("Error updating board");
      disableEditing();
    }
  });

  const generateDescription = trpc.boards.generateDescription.useMutation({
    onSuccess: () => {
      toast.success("Description generation started", {
        description: "This may take some time"
      });
    },
    onError: () => {
      toast.error("Error generating description");
    }
  });

  const [description, setDescription] = useState(board.description || "");
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    update.mutate({
      id: boardId,
      description
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  if (isEditing) {
    return (
      <form action={onSubmit} className="flex flex-col gap-2">
        <div className="items-start">
          <Button
            size="icon"
            variant="outline"
            type="button"
            className="rounded-full size-6 [&_svg]:size-3"
            onClick={() => generateDescription.mutate({ boardId })}
            disabled={generateDescription.isPending}
          >
            {generateDescription.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SparklesIcon />
            )}
          </Button>
        </div>
        <Textarea
          id="description"
          ref={inputRef}
          name="description"
          placeholder="Add a description"
          defaultValue={description}
          onBlur={onBlur}
          rows={3}
          className="text-lg px-[7px] h-32 bg-transparent w-full
          focus-visible:outline-none focus-visible:ring-transparent resize-none"
        />
        <div className="flex items-center gap-x-2 pl-1 pt-4 ">
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
    );
  }

  return (
    <div
      onClick={enableEditing}
      className="text-sm h-56 p-1 px-2 flex flex-col justify-between"
    >
      <p className="line-clamp-6 text-left break-words text-pretty truncate">
        {description || "Add a description"}
      </p>

      <span className="text-gray-500 text-sm justify-end block text-center pointer-events-none">
        {" "}
        (Click to edit)
      </span>
      <span className="sr-only">Edit board description</span>
    </div>
  );
};
