export const DEFAULT_LIMIT = 5;
// Crucial to modify in .env to production domain (including protocol)
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteCongif = {
  name: "Taskify",
  description: "Task management app",
  url: APP_URL,
  ogImage: `${APP_URL}/og.jpg`
};
