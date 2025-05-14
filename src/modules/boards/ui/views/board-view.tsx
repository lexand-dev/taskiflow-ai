import { BoardSection } from "../sections/board-section";

interface BoardViewProps {
  boardId: string;
}

export const BoardView = ({ boardId }: BoardViewProps) => {
  return <BoardSection boardId={boardId} />;
};
