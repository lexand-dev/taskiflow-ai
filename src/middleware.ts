import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/organization(.*)",
  "/select-org"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
  const { orgId, userId } = await auth();

  if (userId && !isProtectedRoute(req)) {
    if (orgId) {
      // Redirect to the dashboard if the user is logged in and not on the dashboard
      return NextResponse.rewrite(new URL(`/organization/${orgId}`, req.url));
    }
    // Redirect to the select organization page if the user is logged in and not on the select organization page
    return NextResponse.rewrite(new URL("/select-org", req.url));
  }

  if (!userId && isProtectedRoute(req)) {
    // Redirect to the sign-in page if the user is not logged in and trying to access a protected route
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
    // Redirect to the select organization page if the user is logged in and not on the select organization page
    return NextResponse.redirect(new URL("/select-org", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
