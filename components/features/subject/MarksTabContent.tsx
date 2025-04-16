import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import DeleteRow from "./DeleteRow";
import AddTableRow from "./AddTableRow";
import EditRow from "./EditRow";
import { TableRowType } from "@/types/TableRow";

type Props = {
  schoolId: string;
  subjectId: number;
};

async function getTable(schoolId: string, subjectId: number) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(
    `/school/${schoolId}/subject/${subjectId}/table`,
    {
      headers: { Authorization: token },
    },
  );
  return res.data;
}

export default async function MarksTabContent({ schoolId, subjectId }: Props) {
  const table: TableRowType[] = await getTable(schoolId, subjectId);
  let total = 0;

  table.forEach((row) => {
    if (row.count) {
      total += row.max;
    }
  });

  return (
    <section className="my-5 flex w-full flex-col items-center justify-center">
      <div className="mt-10 w-full overflow-hidden rounded-md border shadow-sm md:w-[750px]">
        <Table className="border-separate border-spacing-0">
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
              <TableRow key={row.id} className="group">
                <TableCell
                  className={clsx("w-full px-6 py-4 font-medium", {
                    "bg-primary/10 hover:bg-primary/10 border-primary relative border-l":
                      row.count,
                  })}
                >
                  <div className="relative flex items-center">
                    <span
                      className={clsx("text-base", {
                        "text-primary": row.count,
                      })}
                    >
                      {row.name}
                      <>
                        <DeleteRow
                          schoolId={schoolId}
                          subjectId={subjectId}
                          row={row}
                        />
                        <EditRow
                          schoolId={schoolId}
                          subjectId={subjectId}
                          row={row}
                        />
                      </>
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className={clsx("w-full px-6 py-4 font-medium", {
                    "bg-primary/10 hover:bg-primary/10": row.count,
                  })}
                >
                  <span
                    className={clsx("text-base", {
                      "text-primary font-semibold": row.count,
                    })}
                  >
                    {row.max}
                  </span>
                </TableCell>
              </TableRow>
            ))}

            <TableRow className="relative h-9">
              <TableCell>
                <AddTableRow schoolId={schoolId} subjectId={subjectId} />
              </TableCell>
            </TableRow>
          </TableBody>

          <TableFooter className="[&_tr]:shadow">
            <TableRow>
              <TableCell className="px-6 py-4 text-base font-semibold">
                Total
              </TableCell>
              <TableCell className="px-6 py-4 text-right text-base font-semibold">
                {total}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
