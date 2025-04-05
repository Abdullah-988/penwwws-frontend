"use client";

import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { FileText, LoaderCircle, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { getInitials } from "@/lib/utils";

export type SubmissionType = {
  id: number;
  studentId: number;
  assignmentId: number;
  createdAt: string;
  updatedAt: string;
  student: {
    id: number;
    avatarUrl: string | null;
    fullName: string;
    email: string;
  };
  document?: {
    id: number;
    name: string;
    url: string;
    format: string;
    createdAt: string;
    updatedAt: string;
  };
};

async function getSubmissions(
  schoolId: string,
  subjectId: number,
  assignmentId: number,
) {
  const token = await getCookie("token");
  try {
    const res = await axios.get(
      `school/${schoolId}/subject/${subjectId}/assignment/${assignmentId}/submission`,
      {
        headers: { Authorization: token },
      },
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(
      (error.response && error.response.data) || "Unexpected error occurred",
    );
  }
}

type Props = {
  schoolId: string;
  subjectId: number;
  assignmentId: number;
  deadline: Date;
  submissionsCount: number;
};

export default function ViewSubmissions({
  schoolId,
  subjectId,
  assignmentId,
  deadline,
  submissionsCount,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: submissions, isLoading } = useQuery<SubmissionType[]>({
    queryKey: ["submissions", schoolId, subjectId, assignmentId],
    queryFn: async () =>
      await getSubmissions(schoolId, subjectId, assignmentId),
    enabled: isModalOpen,
  });
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="size-4" />
          View Submissions ({submissionsCount})
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-2 md:max-w-[50rem]">
        <DialogHeader>
          <DialogTitle>Assignment Submissions</DialogTitle>
          <DialogDescription>
            {submissionsCount} students have submitted their work
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <LoaderCircle className="text-primary mx-auto my-13 size-8 animate-spin" />
        ) : (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto">
            {submissions?.length ? (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="relative flex flex-col items-center justify-start gap-4 rounded-lg border p-2 md:flex-row md:justify-between md:p-6"
                >
                  {new Date(submission.createdAt) > deadline && (
                    <Badge
                      variant="destructive"
                      className="absolute top-2 right-2"
                    >
                      Submitted after deadline
                    </Badge>
                  )}
                  <div className="flex items-center gap-4">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={submission.student.avatarUrl ?? ""}
                        alt={submission.student.fullName}
                        className="h-full w-full rounded-full"
                      />
                      <AvatarFallback>
                        {getInitials(submission.student.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h4 className="font-medium">
                        {submission.student.fullName}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {submission.student.email}
                      </p>
                      {submission.document && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1 text-xs">
                            <FileText className="h-3 w-3" />
                            {submission.document.format}
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            {format(
                              new Date(submission.createdAt),
                              "MMM dd, yyyy 'at' HH:mm",
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {submission.document && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={submission.document.url}
                        target="_blank"
                        className="hover:text-primary flex gap-2 text-sm hover:underline"
                      >
                        {submission.document.name}
                      </Link>
                      <SquareArrowOutUpRight className="text-primary size-4" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground flex h-32 items-center justify-center">
                No submissions yet
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
