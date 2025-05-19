"use client";

import { Sparkles, FileText } from "lucide-react";

import { BoardDescriptionForm } from "../board-descrip-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BoardSidebar = ({ boardId }: { boardId: string }) => {
  return (
    <div className="shrink-0 h-full w-[300px] select-none flex flex-col gap-4 overflow-y-auto px-2">
      <Card className="py-4 h-76">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>Description</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BoardDescriptionForm boardId={boardId} />
        </CardContent>
      </Card>

      <Card className="py-4 h-96">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Ai</span>
          </CardTitle>
        </CardHeader>
        <CardContent>constent</CardContent>
      </Card>
    </div>
  );
};
