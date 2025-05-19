"use client";

import { ElementRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { ListHeader } from "./list-header";
import { CardForm } from "@/modules/cards/ui/components/card-form";
import { CardItem } from "@/modules/cards/ui/components/card-item";
import { ICard } from "@/modules/cards/types";
import { CardModal } from "@/modules/cards/ui/components/modals";

interface ListProps {
  cards: {
    id: string;
    title: string;
    order: number;
    description: string | null;
    listId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  id: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}
interface ListItemProps {
  data: ListProps;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const [selectedTask, setSelectedTask] = useState<ICard>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (card: ICard) => {
    setSelectedTask(card);
    setIsModalOpen(true);
  };

  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <>
      <Draggable draggableId={data.id} index={index}>
        {(provided) => (
          <li
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="shrink-0 h-full w-[272px] select-none"
          >
            <div
              {...provided.dragHandleProps}
              className="w-full rounded-md bg-primary-foreground shadow-md pb-2"
            >
              <ListHeader onAddCard={enableEditing} data={data} />
              <Droppable droppableId={data.id} type="card">
                {(provided) => (
                  <ol
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                      data.cards.length > 0 ? "mt-2" : "mt-0"
                    )}
                  >
                    {data.cards.map((card, index) => (
                      <CardItem
                        index={index}
                        key={card.id}
                        data={card}
                        onClick={() => handleTaskClick(card)}
                      />
                    ))}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>
              <CardForm
                listId={data.id}
                ref={textareaRef}
                isEditing={isEditing}
                enableEditing={enableEditing}
                disableEditing={disableEditing}
              />
            </div>
          </li>
        )}
      </Draggable>
      {selectedTask && (
        <CardModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
