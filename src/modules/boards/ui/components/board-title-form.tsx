"use client";

import { toast } from "sonner";
import { useState, useRef, ComponentRef } from "react";

import { trpc } from "@/trpc/client";
import { FormInput } from "./form-input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SparklesIcon } from "lucide-react";

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

  const generateTitle = trpc.boards.generateTitle.useMutation({
    onSuccess: () => {
      toast.success("Title generation started", {
        description: "This may take some time"
      });
    },
    onError: () => {
      toast.error("Error generating title");
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
        <div className="flex items-center gap-x-2">
          <Button
            size="icon"
            variant="outline"
            type="button"
            className="rounded-full size-6 [&_svg]:size-3"
            onClick={() => generateTitle.mutate({ boardId })}
            disabled={generateTitle.isPending}
          >
            {generateTitle.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SparklesIcon />
            )}
          </Button>
        </div>
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
