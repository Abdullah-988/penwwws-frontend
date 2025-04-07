import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SchoolUserType } from "@/types/SchoolUser";
import clsx from "clsx";

type TableType = {
  id: number;
  name: string;
  max: number;
  count: boolean;
  subjectId: number;
  createdAt: string;
  updatedAt: string;
}[];

type Props = {
  table: TableType;
  user: SchoolUserType;
};

export default function MarksTable({ table, user }: Props) {
  let total = 0;

  table.forEach((row) => {
    if (row.count) {
      total += row.max;
    }
  });

  return (
    <div className="mt-10 w-full overflow-hidden rounded-md border shadow-sm md:w-[750px]">
      <Table className="border-separate border-spacing-0">
        <TableCaption className="text-muted-foreground mt-2 mb-3 text-base">
          <span className="text-foreground font-medium">{user.fullName}</span>'s
          academic performance summary
        </TableCaption>

        <TableHeader className="[&_tr]:shadow">
          <TableRow className="hover:bg-transparent">
            <TableHead className="bg-muted/40 w-[70%] border-b px-6 py-4 text-base font-semibold">
              Activity
            </TableHead>
            <TableHead className="bg-muted/40 border-b px-6 py-4 text-right text-base font-semibold">
              Grade
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:last-child]:border-0">
          {table.map((row) => (
            <TableRow key={row.id}>
              <TableCell
                className={clsx("w-full px-6 py-4 font-medium", {
                  "bg-primary/10 hover:bg-primary/10 border-primary border-l":
                    row.count,
                })}
              >
                <div className="flex items-center">
                  <span
                    className={clsx("text-[15px]", {
                      "text-primary": row.count,
                    })}
                  >
                    {row.name}
                  </span>
                </div>
              </TableCell>
              <TableCell
                className={clsx("w-full px-6 py-4 font-medium", {
                  "bg-primary/10 hover:bg-primary/10": row.count,
                })}
              >
                <span
                  className={clsx("text-[15px]", {
                    "text-primary font-semibold": row.count,
                  })}
                >
                  {row.max}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter className="[&_tr]:shadow">
          <TableRow>
            <TableCell className="bg-muted/30 border-t px-6 py-4 text-base font-semibold">
              Total Score
            </TableCell>
            <TableCell className="bg-muted/30 border-t px-6 py-4 text-right text-base font-semibold">
              {total}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
