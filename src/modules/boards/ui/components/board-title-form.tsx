"use client";

import { toast } from "sonner";
import { useState, useRef, ComponentRef } from "react";

import { trpc } from "@/trpc/client";
import { FormInput } from "./form-input";
import { Button } from "@/components/ui/button";

interface BoardTitleFormProps {
  boardId: string;
}

export const BoardTitleForm = ({ boardId }: BoardTitleFormProps) => {
  const formRef = useRef<ComponentRef<"form">>(null);
  const inputRef = useRef<ComponentRef<"input">>(null);

  const utils = trpc.useUtils();

  const [board] = trpc.boards.getOne.useSuspenseQuery({ id: boardId });

  const update = trpc.boards.update.useMutation({
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated!`);
      setTitle(data.title);
      disableEditing();
      utils.boards.getOne.invalidate({ id: boardId });
      utils.boards.getMany.invalidate();
    },
    onError: () => {
      toast.error("Error updating board");
      disableEditing();
    }
  });

  const [title, setTitle] = useState(board.title);
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
    const title = formData.get("title") as string;
    update.mutate({
      id: boardId,
      title
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  if (isEditing) {
    return (
      <form
        action={onSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          id="title"
          ref={inputRef}
          defaultValue={title}
          onBlur={onBlur}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent
          focus-visible:outline-none focus-visible:ring-transparent border-none text-white"
        />
        <Button className="text-white" size="sm" type="submit">
          Save
        </Button>
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2 text-white"
    >
      {title}
    </Button>
  );
};
