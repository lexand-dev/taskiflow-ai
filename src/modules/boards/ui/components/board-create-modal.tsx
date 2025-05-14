import { toast } from "sonner";

import { z } from "zod";
import { FormPicker } from "./form-picker";
import { ResponsiveModal } from "@/components/responsive-modal";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AiFeaturesAlert } from "./ai-features-alert";
import { Hint } from "./hint";
import { HelpCircle } from "lucide-react";

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
  // TODO: Add pro modal
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      description: ""
    }
  });

  const utils = trpc.useUtils();
  const create = trpc.boards.create.useMutation({
    onSuccess: (data) => {
      console.log({
        data
      });
      toast.success("Boad created");
      utils.boards.getMany.invalidate();
      form.reset();
      onOpenChange(false);
    },
    onError: (e) => {
      console.error(e);
      toast.error("Something went wrong");
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate(values);
  };

  return (
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
              label="Selecciona una imagen"
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
  );
};
