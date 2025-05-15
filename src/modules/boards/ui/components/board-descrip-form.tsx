"use client";

import { toast } from "sonner";
import { useState, useRef, ComponentRef } from "react";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
      <form action={onSubmit} className="flex flex-col items-center gap-x-2">
        <Textarea
          id="description"
          ref={inputRef}
          name="description"
          placeholder="Add a description"
          defaultValue={description}
          onBlur={onBlur}
          rows={3}
          className="text-lg px-[7px] py-1 h-32 bg-transparent w-full
          focus-visible:outline-none focus-visible:ring-transparent resize-none"
        />
        <Button size="sm" type="submit" className="mt-2">
          Save
        </Button>
      </form>
    );
  }

  return (
    <div
      onClick={enableEditing}
      className="text-sm h-44 p-1 px-2 flex flex-col justify-between"
    >
      <p className="line-clamp-8 text-left break-words text-pretty">
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
