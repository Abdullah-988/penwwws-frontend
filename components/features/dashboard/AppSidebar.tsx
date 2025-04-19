"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Home, Settings, LibraryBig, Users, Fingerprint } from "lucide-react";

import { SchoolSwitcher } from "@/components/features/dashboard/SchoolSwitcher";
import { NavUser } from "@/components/features/dashboard/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const tabs = [
  {
    title: "Home",
    url: "dashboard",
    icon: Home,
  },
  { title: "Subjects", url: "dashboard/subjects", icon: LibraryBig },
  { title: "Groups", url: "dashboard/groups", icon: Users },
  { title: "Attendance", url: "dashboard/attendance", icon: Fingerprint },
  { title: "Settings", url: "dashboard/settings", icon: Settings },
];

type Props = {
  activeSchoolId: string;
};

export function AppSidebar({ activeSchoolId }: Props) {
  const pathname = usePathname();

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
              return (
                <Link
                  key={tab.title}
                  href={`/school/${activeSchoolId}/${tab.url}`}
                >
                  <SidebarMenuItem key={tab.title}>
                    <SidebarMenuButton
                      className={clsx({
                        "bg-primary text-white duration-150": isActive,
                      })}
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
