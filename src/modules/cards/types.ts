import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type Card = inferRouterOutputs<AppRouter>["cards"]["getOne"];
