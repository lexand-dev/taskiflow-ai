"use client";

import { ICard } from "../../types";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";

interface CardItemProps {
  index: number;
  data: ICard;
  onClick: () => void;
}

export const CardItem = ({ index, data, onClick }: CardItemProps) => {
  return (
    <>
      <Draggable draggableId={data.id} index={index}>
        {(provided) => (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={onClick}
            className="cursor-pointer hover:shadow-md transition-shadow border border-border/40 p-3"
          >
            {/*             {task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.labels.map((label) => (
                  <Badge
                    key={label}
                    variant="outline"
                    className={`text-xs px-1.5 py-0 h-5 ${getLabelColor(
                      label
                    )}`}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            )} */}

            <h4 className="font-medium text-sm">{data.title}</h4>
            {data.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {data.description}
              </p>
            )}
          </Card>
        )}
      </Draggable>
    </>
  );
};
