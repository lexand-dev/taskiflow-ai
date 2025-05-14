import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
/* import { ListContainer } from "./_components/list-container"; */

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

  return <div className="p-4 h-full overflow-x-auto">{params.boardId}</div>;
};

export default BoardIdPage;
