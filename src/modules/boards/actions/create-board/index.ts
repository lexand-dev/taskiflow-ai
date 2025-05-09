"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { boards } from "@/db/schema";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";

import { desc, eq } from "drizzle-orm";

export const createBoard = async (prev, formData: FormData): Promise<any> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "You must be logged in to create a board."
    };
  }

  const title = formData.get("title") as string;
  const image = formData.get("image") as string;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "An unexpected error occurred. Please try again."
    };
  }

  let board;

  try {
    board = await db.insert(boards).values({
      title,
      orgId,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
      imageUserName
    });

    //TODO: add action audit log
  } catch {
    return {
      error: "An unexpected error occurred. Please try again."
    };
  }

  revalidatePath(`/boards/${board.id}`);
  return {
    prev,
    data: board
  };
};
