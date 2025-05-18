"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

/* import { updateCardOrder } from "@/actions/update-card-order"; */
import { ListWithCards } from "../../types";

import { toast } from "sonner";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { trpc } from "@/trpc/client";

interface ListContainerProps {
  data: ListWithCards;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const updateListOrder = trpc.lists.updateListOrder.useMutation({
    onSuccess: () => {
      toast.success("List order updated");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    }
  });

  /*   const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card order updated");
    },
    onError: (error) => {
      toast.error(error);
    }
  }); */

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }
    //if dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      updateListOrder.mutate({ items });
    }

    // User moves a card
    if (type === "card") {
      const newOrderedData = [...orderedData];
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      // check if cards exists on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // check if cards exists on the destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        /*         executeUpdateCardOrder({ items: reorderedCards, boardId }); */
      } else {
        // Moving the card to another list
        // Remove the card from the source list and add it to the destination list
        const [moveCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        moveCard.listId = destination.droppableId;

        // Add the card to the destination list
        destinationList.cards.splice(destination.index, 0, moveCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Updat the order for each card in the destination list
        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        /*         executeUpdateCardOrder({
          items: destinationList.cards,
          boardId
        }); */
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            className="flex gap-x-3 h-full"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} data={list} index={index} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
