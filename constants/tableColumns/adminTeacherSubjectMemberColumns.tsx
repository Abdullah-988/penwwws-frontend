"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components//ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { capitalizeFirstLetter, getInitials } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberType } from "@/types/member";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import UnassignSubject from "@/components/features/subject/UnassignSubject";
import { SubjectDetailType } from "@/types/Subject";

export function getColumns(
  schoolId: string,
  subject: SubjectDetailType,
): ColumnDef<MemberType>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          id="select"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={`/school/${schoolId}/subjects/${subject.id}/members/${row.original.id}`}
          className="flex items-center"
        >
          <Avatar className="size-7 rounded-full">
            <AvatarFallback>
              {getInitials(row.getValue("fullName"))}
            </AvatarFallback>
            <AvatarImage src={row.original.avatarUrl} />
          </Avatar>
          <span className="ml-2 hover:underline">
            {row.getValue("fullName")}
          </span>
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "groups",
      header: "Group(s)",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.groups &&
            row.original.groups.map((group) => (
              <Badge
                key={group.id}
                className="text-primary-800 bg-primary-800/10 rounded-full"
              >
                {group.name}
              </Badge>
            ))}
        </div>
      ),

      filterFn: (row, _columnId, filterValue) => {
        return row.original.groups.some((group) =>
          filterValue.includes(group.id),
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const badgeColor = {
          SUPER_ADMIN: "bg-red-800/10 text-red-800",
          ADMIN: "bg-purple-800/10 text-purple-800",
          TEACHER: "bg-amber-800/10 text-amber-800",
          STUDENT: "bg-blue-800/10 text-blue-800",
        };

        return (
          <Badge className={clsx("rounded-full", badgeColor[role])}>
            {capitalizeFirstLetter(role)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const email = row.original.email;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <UnassignSubject
                schoolId={schoolId}
                selectedMemberIds={[row.original.id]}
                subject={subject}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(email)}
              >
                Copy member email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
