import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type ICard = inferRouterOutputs<AppRouter>["cards"]["getOne"];
