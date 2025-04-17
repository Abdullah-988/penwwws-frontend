"use client";

import { AssignmentType } from "@/types/AssignmentType";
import { FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import SubmitSubmission from "@/components/features/subject/SubmitSubmission";
import DeleteSubmission from "@/components/features/subject/DeleteSubmission";
import clsx from "clsx";

type Props = {
  schoolId: string;
  subjectId: number;
  assignment: AssignmentType;
};

export function StudentAssignmentCard({
  schoolId,
  subjectId,
  assignment,
}: Props) {
  const deadline = new Date(assignment.deadline);
  const isPastDeadline = deadline < new Date();

  const isSubmittedAfterDeadline =
    assignment.submission &&
    new Date(assignment.submission.createdAt) > deadline;

  return (
    <div className="relative flex flex-col justify-between gap-6 rounded-md border p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{assignment.title}</h3>
          {isPastDeadline && <Badge variant="destructive">Past Due</Badge>}
        </div>
        <div className="text-muted-foreground text-sm">
          <span className="font-medium">Due:</span>{" "}
          {format(deadline, "MMM dd, yyyy HH:mm")}
        </div>
      </div>
      {assignment.document && (
        <div className="rounded-md p-3 shadow">
          <p className="text-primary text-sm font-medium">Attachments:</p>
          <div className="flex items-center gap-1">
            <Link
              key={assignment.document.id}
              href={assignment.document.url}
              target="_blank"
              className="hover:text-primary line-clamp-1 flex items-center gap-2 text-sm hover:underline"
            >
              <FileText className="text-primary size-4" />
              <span>{assignment.document.name}</span>
            </Link>

            <Badge variant="outline" className="h-fit gap-1 text-xs">
              <FileText className="size-3" />
              {assignment.submission?.document?.format}
            </Badge>
          </div>
        </div>
      )}

      {assignment.submission ? (
        <div
          className={clsx("rounded p-3", {
            "bg-destructive/5 text-destructive": isSubmittedAfterDeadline,
            "bg-primary/5 text-primary": !isSubmittedAfterDeadline,
          })}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="flex items-center gap-1">
                <Link
                  href={assignment.submission.document?.url ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-1 text-sm font-semibold hover:underline"
                >
                  {assignment.submission.document?.name}{" "}
                </Link>
              </div>
              <div className="flex gap-2">
                {isSubmittedAfterDeadline ? (
                  <Badge variant="destructive">
                    Submitted after deadline {format(new Date(), "MMM dd")}
                  </Badge>
                ) : (
                  <Badge className="ml-2">
                    Submitted {format(new Date(), "MMM dd")}
                  </Badge>
                )}
                <Badge variant="outline" className="h-fit gap-1 text-xs">
                  <FileText className="size-3" />
                  {assignment.submission.document?.format}
                </Badge>
              </div>
            </div>
            <DeleteSubmission
              schoolId={schoolId}
              subjectId={subjectId}
              assignmentId={assignment.id}
              submissionId={assignment.submission?.id}
            />
          </div>
        </div>
      ) : (
        <SubmitSubmission
          schoolId={schoolId}
          subjectId={subjectId}
          assignmentId={assignment.id}
        />
      )}
    </div>
  );
}
