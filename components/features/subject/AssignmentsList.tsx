import { AssignmentType } from "@/types/AssignmentType";
import { SchoolUserType } from "@/types/SchoolUser";
import { Button } from "@/components/ui/button";
import { Pencil, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import DeleteAssignment from "./DeleteAssignment";

type Props = {
  schoolId: string;
  subjectId: number;
  user: SchoolUserType;
  assignments: AssignmentType[];
};

export default function AssignmentsList({
  schoolId,
  subjectId,
  user,
  assignments,
}: Props) {
  if (!assignments) return null;
  return (
    <section className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="relative flex h-64 flex-col justify-between rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
        >
          {/* Header with title and actions */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{assignment.title}</h3>
            <div className="flex gap-2">
              {user.role !== "STUDENT" && (
                <>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <DeleteAssignment
                    schoolId={schoolId}
                    subjectId={subjectId}
                    assignment={assignment}
                  />
                </>
              )}
            </div>
          </div>

          <div className="text-muted-foreground mt-2 text-sm">
            <span className="font-medium">Due:</span>{" "}
            {format(new Date(assignment.deadline), "MMM dd, yyyy HH:mm")}
          </div>

          {assignment.documents?.length > 0 && (
            <div className="mt-4 flex-1">
              <p className="text-muted-foreground mb-2 text-sm font-medium">
                Attachments:
              </p>
              <div className="space-y-1">
                {assignment.documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    className="flex items-center gap-2 text-sm hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{doc.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {user.role === "STUDENT" && (
            <div className="mt-4 border-t pt-4">
              {false ? (
                <div className="text-sm text-green-600">
                  Submitted:{" "}
                  {format(new Date(assignment.createdAt), "MMM dd HH:mm")}
                </div>
              ) : (
                <Button variant="outline" className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Submit Assignment
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
