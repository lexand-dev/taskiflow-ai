import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
/* import { ListContainer } from "./_components/list-container"; */
import { boards } from "@/db/schema";
import { eq } from "drizzle-orm";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { orgId } = await auth();

  if (!orgId) {
    redirect("/select-org");
  }

  /*   const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId
      }
    },
    include: {
      cards: {
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: {
      order: "asc"
    }
  }); */

  return <div className="p-4 h-full overflow-x-auto">{params.boardId}</div>;
};

export default BoardIdPage;
