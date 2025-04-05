"use client";

import { AssignmentType } from "@/types/AssignmentType";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ViewSubmissions from "@/components/features/subject/ViewSubmissions";
import DeleteAssignment from "./DeleteAssignment";
import { format } from "date-fns";

type Props = {
  schoolId: string;
  subjectId: number;
  assignment: AssignmentType;
};

export function TeacherAssignmentCard({
  schoolId,
  subjectId,
  assignment,
}: Props) {
  const deadline = new Date(assignment.deadline);
  const isPastDeadline = deadline < new Date();

  return (
    <div className="relative flex flex-col justify-between gap-6 rounded-md border p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1">
            <h3 className="text-lg font-semibold">{assignment.title}</h3>
            {isPastDeadline && <Badge variant="destructive">Past Due</Badge>}
          </div>
          <DeleteAssignment
            schoolId={schoolId}
            subjectId={subjectId}
            assignment={assignment}
          />
        </div>
        <div className="text-muted-foreground text-sm">
          <span className="font-medium">Due:</span>
          {format(deadline, "MMM dd, yyyy HH:mm")}
        </div>
      </div>

      {assignment.document && (
        <div className="rounded-md p-3 shadow">
          <p className="text-primary text-sm font-medium">Attachments:</p>
          <div className="flex gap-2 space-y-1">
            <Link
              key={assignment.document.id}
              href={assignment.document.url}
              className="hover:text-primary flex items-center gap-2 text-sm hover:underline"
            >
              <FileText className="text-primary size-4" />
              <span className="line-clamp-2 w-full">
                {assignment.document.name}
              </span>
            </Link>
            <Badge variant="outline" className="h-fit gap-1 text-xs">
              <FileText className="size-3" />
              {assignment.document.format}
            </Badge>
          </div>
        </div>
      )}
      <ViewSubmissions
        schoolId={schoolId}
        subjectId={subjectId}
        assignmentId={assignment.id}
        deadline={deadline}
        submissionsCount={assignment._count.submissions}
      />
    </div>
  );
}
