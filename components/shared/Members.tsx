"use client";

import GetMembers from "@/fetches/members";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { getInitials } from "@/lib/utils";

type Member = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

type Props = {
  schoolId: string;
};

export default function Members({ schoolId }: Props) {
  const [role, setRole] = useState<"ADMIN" | "TEACHER" | "STUDENT" | "ALL">(
    "ALL",
  );

  const { data: members = [], refetch } = useQuery({
    queryKey: ["members", schoolId],
    queryFn: () => GetMembers(schoolId, { role }),
  });

  useEffect(() => {
    refetch();
  }, [refetch, role]);

  const columns: ColumnDef<Member>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          onChange={() => {
            table.toggleAllRowsSelected();
          }}
          checked={table.getIsAllRowsSelected()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
        />
      ),
    },
    {
      accessorKey: "id",
      header: "Member ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "fullName",
      header: "Name",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-6 rounded-full">
            <AvatarFallback>
              {getInitials(info.getValue() as string)}
            </AvatarFallback>
            <AvatarImage src={info.row.original.avatarUrl} />
          </Avatar>
          <p>{info.getValue() as string}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => info.getValue(),
    },
  ];

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-2">
        <Input
          placeholder="Search for member..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ||
            (table.getColumn("email")?.getFilterValue() as string) ||
            ""
          }
          onChange={(e) => {
            table.getColumn("fullName")?.setFilterValue(e.target.value);
          }}
          className="max-w-sm"
        />
        <Select
          value={role}
          onValueChange={(value: "ADMIN" | "TEACHER" | "STUDENT" | "ALL") =>
            setRole(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="TEACHER">Teacher</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
