import { toast } from "sonner";
import { ElementRef, useActionState, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";

import { FormPicker } from "./form-picker";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { createBoard } from "@/modules/boards/actions/create-board";
import { ResponsiveModal } from "@/components/responsive-modal";

interface BoardCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BoardCreateModal = ({
  open,
  onOpenChange
}: BoardCreateModalProps) => {
  const proModal = useProModal();
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);

  const [data, formAction] = useActionState(createBoard, null);

  /*   const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    execute({ title, image });
    toast.success("Board created!");
    closeRef.current?.click();
    router.push(`/board/${data.id}`);
  }; */

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create board"
    >
      <form action={formAction} className="space-y-4">
        <div className="space-y-4">
          <FormPicker id="image" />
          <FormInput id="title" label="Board title" type="text" />
        </div>
        <FormSubmit className="w-full">Create</FormSubmit>
      </form>
    </ResponsiveModal>
  );
};
