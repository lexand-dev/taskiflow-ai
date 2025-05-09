import { db } from "@/db";
import { boards } from "@/db/schema";
import { BoardView } from "@/modules/boards/ui/views/board-view";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const OrganizationIdPage = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const data = await db
    .select()
    .from(boards)
    .where(eq(boards.orgId, orgId))
    .orderBy(desc(boards.createdAt));
  return <BoardView data={JSON.parse(JSON.stringify(data))} />;
};

export default OrganizationIdPage;
