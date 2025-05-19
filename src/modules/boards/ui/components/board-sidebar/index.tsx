"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { FileText, ImageIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SparklesIcon } from "lucide-react";

import { BoardDescriptionForm } from "../board-descrip-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormPicker } from "../form-picker";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  image: z.string().min(1)
});

export const BoardSidebar = ({ boardId }: { boardId: string }) => {
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: ""
    }
  });

  const update = trpc.boards.update.useMutation({
    onSuccess: () => {
      toast.success(`Board description updated!`);
      utils.boards.getOne.invalidate({ id: boardId });
    },
    onError: (e) => {
      console.error(e);
      toast.error("Error updating board");
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Assuming values.image is a string formatted as "imageId|imageThumbUrl|imageFullUrl|imageUserName|imageLinkHTML"
    const imageParts = values.image.split("|");

    if (imageParts.length < 5) {
      toast.error("Invalid image data format.");
      console.error("Invalid image data format from picker:", values.image);
      return;
    }

    const [imageId, imageThumbUrl, imageFullUrl, imageUserName, imageLinkHTML] =
      imageParts;

    update.mutate({
      id: boardId,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageUserName,
      imageLinkHTML
    });
  };

  return (
    <div className="shrink-0 h-full w-[300px] select-none flex flex-col gap-4 overflow-y-auto px-2">
      <Card className="py-4 h-76">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <FileText className="h-4 w-4" />
            <span className="inline-block">Description</span>

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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BoardDescriptionForm boardId={boardId} />
        </CardContent>
      </Card>

      <Card className="py-4 h-64">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="mr-2 h-4 w-4" />
            <span>Images</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormPicker
                name="image"
                control={form.control}
                disabled={update.isPending}
              />
              <Button disabled={update.isPending} type="submit" variant="ghost">
                {update.isPending ? "Loading..." : "Update Image"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
