"use client";

import { Sparkles, FileText } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BoardSidebar = () => {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row pt-28"
    >
      <Sidebar
        collapsible="none"
        className="hidden flex-1 md:flex bg-violet-100"
      >
        <SidebarContent>
          <SidebarGroup className="py-6 px-4">
            <SidebarGroupContent className="flex flex-col gap-y-4">
              <SidebarMenuItem className="list-none">
                <Card className="py-4 h-64">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Description</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>constent</CardContent>
                </Card>
              </SidebarMenuItem>

              <SidebarMenuItem className="list-none">
                <Card className="py-4 h-96">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Ai</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>constent</CardContent>
                </Card>
              </SidebarMenuItem>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
};
