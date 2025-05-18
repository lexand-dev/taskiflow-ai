import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type ListWithCards = inferRouterOutputs<AppRouter>["lists"]["getMany"];
