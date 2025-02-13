"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSchools } from "@/services/school";
import { getInitials } from "@/lib/utils";
import { SchoolType } from "@/types/School";
import Link from "next/link";
import { getRoleRedirectPath } from "@/lib/utils";

type Props = { activeSchoolId: string };

export function SchoolSwitcher({ activeSchoolId }: Props) {
  const { data: schools } = useQuery<SchoolType[]>({
    queryKey: ["schools"],
    queryFn: getSchools,
    refetchInterval: false,
  });
  const { isMobile } = useSidebar();

  const activeSchool = schools?.filter(
    ({ school }) => school.id === activeSchoolId,
  );

  if (!schools) return;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {activeSchool && (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary">
                    {getInitials(activeSchool[0].school.name)}
                  </AvatarFallback>
                  <AvatarImage src={activeSchool[0].school.logoUrl} />
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeSchool[0].school.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeSchool[0].school.description}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Schools
            </DropdownMenuLabel>
            {schools.map(({ school }, index) => (
              <Link
                key={school.id}
                href={`/school/${school.id}/${getRoleRedirectPath(school.members[0].role)}`}
              >
                <DropdownMenuItem key={school.name} className="gap-2 p-2">
                  <Avatar className="size-8">
                    <AvatarFallback>{getInitials(school.name)}</AvatarFallback>
                    <AvatarImage src={school.logoUrl} />
                  </Avatar>
                  {school.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
