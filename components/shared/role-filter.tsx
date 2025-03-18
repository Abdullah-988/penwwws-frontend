import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { MemberType } from "./columns";

type Props = {
  table: Table<MemberType>;
};
export default function RoleFilter({ table }: Props) {
  return (
    <Select
      value={(table.getColumn("role")?.getFilterValue() as string) || "ALL"}
      onValueChange={(value) => {
        table.getColumn("role")?.setFilterValue(value === "ALL" ? "" : value);
      }}
    >
      <SelectTrigger className="w-32">
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
