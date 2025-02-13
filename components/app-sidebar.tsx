import * as React from "react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { SchoolSwitcher } from "./school-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  activeSchoolId: string;
  tabs: { title: string; url: string; icon: LucideIcon }[];
  pathname: string;
};

export function AppSidebar({ activeSchoolId, tabs, pathname }: Props) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SchoolSwitcher activeSchoolId={activeSchoolId} />
      </SidebarHeader>
      <SidebarContent className="justify-between">
        <SidebarGroup>
          <SidebarMenu>
            {tabs.map((tab) => {
              const isActive =
                pathname === `/school/${activeSchoolId}/${tab.url}`;
              console.log(isActive);
              console.log(pathname);
              console.log("hello", `/school/${activeSchoolId}/${tab.url}`);

              return (
                <Link
                  key={tab.title}
                  href={`/school/${activeSchoolId}/${tab.url}`}
                >
                  <SidebarMenuItem key={tab.title}>
                    <SidebarMenuButton
                      className={clsx({ "bg-accent": isActive })}
                      tooltip={tab.title}
                    >
                      {tab.icon && <tab.icon />}
                      <span>{tab.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
