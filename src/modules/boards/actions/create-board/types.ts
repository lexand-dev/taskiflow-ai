import { z } from "zod";
import { boardSelectSchema } from "@/db/schema";

import { ActionState } from "@/lib/create-safe-action";

import { CreateBoard } from "./schema";

export type InputType = z.infer<typeof CreateBoard>;
export type ReturnType = ActionState<
  InputType,
  z.infer<typeof boardSelectSchema>
>;
