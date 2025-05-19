"use client";

import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { ICard } from "@/modules/cards/types";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  data: ICard;
}

export const Header = ({ data }: HeaderProps) => {
  const update = trpc.cards.update.useMutation({
    onSuccess: (data) => {
      // Invalidate card getOne query
      // Invalidate card-logs query
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong");
    }
  });

  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    if (title === data.title) {
      return;
    }

    update.mutate({
      title,
      id: data.id
    });
  };

  return (
    <div className="pr-8">
      <form action={onSubmit}>
        <Input
          ref={inputRef}
          onBlur={onBlur}
          id="title"
          name="title"
          defaultValue={title}
          className="md:text-xl font-semibold px-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 "
          placeholder="Task title"
        />
      </form>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
