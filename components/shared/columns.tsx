"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GroupType } from "@/types/Group";

export type MemberType = {
  id: string;
  fullName: string;
  email: string;
  groups: GroupType[];
  avatarUrl?: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

export const columns: ColumnDef<MemberType>[] = [
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
      <div className="flex items-center">
        <Avatar className="size-7 rounded-full">
          <AvatarFallback>
            {getInitials(row.getValue("fullName"))}
          </AvatarFallback>
          <AvatarImage src={row.original.avatarUrl}></AvatarImage>
        </Avatar>
        <span className="ml-2">{row.getValue("fullName")}</span>
      </div>
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
      <div className="items-center">
        {row.original.groups.map((group) => (
          <span
            className="text-primary bg-primary/15 ml-1 rounded-full px-2 py-0.5 text-xs font-medium"
            key={group.id}
          >
            {group.name}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <span className="text-primary bg-primary/15 ml-1 rounded-full px-2 py-0.5 text-xs font-medium">
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </span>
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(email)}
            >
              Copy member email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Remove member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
