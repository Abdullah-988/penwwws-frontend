import Navbar from "@/components/shared/Navbar";
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
import EnterStudentMark from "@/components/features/subject/EnterStudentMark";
import { TableRowType } from "@/types/TableRow";
import { getUser } from "@/fetches/schoolUser";

async function getTable(
  schoolId: string,
  subjectId: number,
  studentId: number,
) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(
    `/school/${schoolId}/subject/${subjectId}/table/student/${studentId}`,
    {
      headers: { Authorization: token },
    },
  );
  return res.data;
}

export type EnterMarksTableRowType = TableRowType & {
  marks: {
    id: number;
    value: number;
    tableRowId: number;
    studentId: number;
    createdAt: string;
    updatedAt: string;
  }[];
};

export default async function StudentsMarkPage({
  params,
}: {
  params: Promise<{ id: string; subjectId: number; studentId: number }>;
}) {
  const schoolId = (await params).id;
  const subjectId = (await params).subjectId;
  const studentId = (await params).studentId;
  const user = await getUser(schoolId);
  const table: EnterMarksTableRowType[] = await getTable(
    schoolId,
    subjectId,
    studentId,
  );
  let total = 0;
  let totalStudentMark = 0;

  table.forEach((row) => {
    if (row.count) {
      total += row.max;
      if (row.marks.length) totalStudentMark += row.marks[0].value;
    }
  });

  return (
    <>
      <Navbar schoolId={schoolId} user={user} />

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
                      className={clsx("flex items-center gap-2 text-[15px]", {
                        "text-primary font-semibold": row.count,
                      })}
                    >
                      <EnterStudentMark
                        schoolId={schoolId}
                        subjectId={subjectId}
                        row={row}
                        studentId={studentId}
                      />
                      /{row.max}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter className="[&_tr]:shadow">
              <TableRow>
                <TableCell className="px-6 py-4 text-base font-semibold">
                  Total Score
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-base font-semibold">
                  {totalStudentMark} /{total}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>
    </>
  );
}
