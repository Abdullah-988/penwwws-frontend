"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import { getSchools } from "@/fetches/schools";
import { SchoolType } from "@/types/School";
import { getInitials, getRoleRedirectPath } from "@/lib/utils";
import Link from "next/link";

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
import { Skeleton } from "@/components/ui/skeleton";

type Props = { activeSchoolId: string };

export function SchoolSwitcher({ activeSchoolId }: Props) {
  const { data: schools, isLoading } = useQuery<SchoolType[]>({
    queryKey: ["schools"],
    queryFn: getSchools,
    refetchInterval: false,
  });
  const { isMobile } = useSidebar();

  const activeSchool = schools?.find(
    ({ school }) => school.id === activeSchoolId,
  );
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 p-2">
            <Skeleton className="size-8 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-2 w-32" />
              <Skeleton className="h-2 w-20" />
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!schools) return null;

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
                    {getInitials(activeSchool.school.name)}
                  </AvatarFallback>
                  <AvatarImage
                    alt={activeSchool.school.name}
                    src={activeSchool.school.logoUrl}
                  />
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeSchool.school.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeSchool.school.description}
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
                    <AvatarImage alt={school.name} src={school.logoUrl} />
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
