"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { MemberType } from "@/types/member";
import { useEffect } from "react";

type Props = {
  table: Table<MemberType>;
  defaultFilteredRole?: "TEACHER" | "ADMIN" | "STUDENT";
};

export default function RoleFilter({ table, defaultFilteredRole }: Props) {
  useEffect(() => {
    if (defaultFilteredRole) {
      table.getColumn("role")?.setFilterValue(defaultFilteredRole);
    }
  }, [defaultFilteredRole, table]);

  return (
    <Select
      value={(table.getColumn("role")?.getFilterValue() as string) || "ALL"}
      onValueChange={(value) => {
        table.getColumn("role")?.setFilterValue(value === "ALL" ? "" : value);
      }}
    >
      <SelectTrigger className="w-28">
        <SelectValue placeholder="Filter by role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Roles</SelectItem>{" "}
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="TEACHER">Teacher</SelectItem>
        <SelectItem value="STUDENT">Student</SelectItem>
      </SelectContent>
    </Select>
  );
}
