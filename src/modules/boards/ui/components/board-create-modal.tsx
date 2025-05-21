import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HelpCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResponsiveModal } from "@/components/responsive-modal";

import { Hint } from "./hint";
import { trpc } from "@/trpc/client";
import { FormPicker } from "./form-picker";
import { AiFeaturesAlert } from "./ai-features-alert";
import { ProModal } from "@/modules/orglimit/pro-modal";

interface BoardCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  image: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(2)
});

export const BoardCreateModal = ({
  open,
  onOpenChange
}: BoardCreateModalProps) => {
  const [openProModal, setOpenProModal] = useState(false);

  const utils = trpc.useUtils();
  const router = useRouter();
  const params = useParams();
  const { organizationId } = params as { organizationId: string };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      description: ""
    }
  });

  const create = trpc.boards.create.useMutation({
    onSuccess: (data) => {
      utils.boards.getMany.invalidate();
      toast.success("Boad created");
      form.reset();
      onOpenChange(false);
      router.push(`/board/${data.id}`);
    },
    onError: (e) => {
      console.error(e);
      toast.error(e.message);
      setOpenProModal(true);
      onOpenChange(false);
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate(values);
  };

  return (
    <>
      <ProModal
        orgId={organizationId}
        open={openProModal}
        onOpenChange={setOpenProModal}
        title="Upgrade to Taskiflow Pro"
      />
      <ResponsiveModal
        open={open}
        onOpenChange={onOpenChange}
        title="Create board"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormPicker
                name="image"
                control={form.control}
                label="Select an image"
                disabled={create.isPending}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Board title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="My new board" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center gap-x-1">
                        <FormLabel>Description</FormLabel>
                        <Hint
                          side="top"
                          description="Provide more details for improved AI assistance."
                        >
                          <HelpCircle className="size-3.5 mt-1" />
                        </Hint>
                      </div>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your new project"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <AiFeaturesAlert />
            <div className="flex justify-end">
              <Button
                disabled={create.isPending}
                type="submit"
                className="text-white"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </>
  );
};
