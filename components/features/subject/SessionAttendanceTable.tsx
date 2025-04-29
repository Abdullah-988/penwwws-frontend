"use client";

import { TableSearch } from "@/components/shared/TableSearch";
import { SessionType } from "@/types/session";
import RemoveAttender from "@/components/features/subject/RemoveAttender";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { SessionAttenderType } from "@/types/SessionAttenerType";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import {
  ColumnFiltersState,
  FilterFn,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const globalFilterFn: FilterFn<SessionAttenderType> = (
  row: Row<SessionAttenderType>,
  _columnId: string,
  filterValue: string,
) => {
  const fullName = row.original.fullName.toLowerCase();
  const email = row.original.email.toLowerCase();
  const id = row.original.id;
  return (
    fullName.includes(filterValue.toLowerCase()) ||
    email.includes(filterValue.toLowerCase()) ||
    id === parseInt(filterValue)
  );
};

type Props = {
  session: SessionType;
  schoolId: string;
  subjectId: number;
  data: SessionAttenderType[];
};

export default function SessionAttendersTable({
  session,
  schoolId,
  subjectId,
  data,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<SessionAttenderType>[] = [
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
            <AvatarImage src={row.original.avatarUrl} />
          </Avatar>
          <span className="ml-2">{row.getValue("fullName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "attended",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.attended ? (
            <Badge className="bg-primary/15 text-primary text-xs">
              Attended
            </Badge>
          ) : (
            <Badge className="bg-destructive/15 text-destructive text-xs">
              Not Attended
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const attendanceId = row.original.attendanceId;
        const email = row.original.email;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {row.original.attended && (
                <RemoveAttender
                  schoolId={schoolId}
                  subjectId={subjectId}
                  session={session}
                  attendanceId={attendanceId}
                />
              )}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(email)}
              >
                Copy Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  useEffect(() => {
    table.getColumn("attended")?.setFilterValue(true);
  }, [table]);

  return (
    <div className="w-full overflow-auto p-1">
      <div className="flex items-center gap-4 py-4">
        <TableSearch
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <Select
          value={table.getColumn("attended")?.getFilterValue() as string}
          onValueChange={(value) => {
            table
              .getColumn("attended")
              ?.setFilterValue(value === "attended" ? true : false);
          }}
        >
          <SelectTrigger className="w-36">
            {table.getColumn("attended")?.getFilterValue()
              ? "Attended"
              : "Not Attended"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="attended">Attended</SelectItem>
            <SelectItem value="not-attended">Not Attended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
    </div>
  );
}
