import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { BoardOptions } from "./board-options";
import { BoardTitleForm } from "./board-title-form";

interface BoardNavbarProps {
  boardId: string;
}

export const BoardNavbar = ({ boardId }: BoardNavbarProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const remove = trpc.boards.delete.useMutation({
    onSuccess: (data) => {
      utils.boards.getMany.invalidate();
      toast.success("Board deleted!");
      router.push(`/organization/${data.orgId}`);
    },
    onError: () => {
      toast.error("Something went wrong");
    }
  });

  const onDelete = () => {
    remove.mutate({ boardId });
  };

  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm boardId={boardId} />
      <div className="ml-4">
        <BoardOptions isLoading={remove.isPending} onDelete={onDelete} />
      </div>
    </div>
  );
};
