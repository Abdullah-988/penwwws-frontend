"use client";

import { DocumentType } from "@/types/Document";
import React from "react";
import { SchoolUserType } from "@/types/SchoolUser";
import { FileText, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TopicType } from "@/types/Topic";
import EditDocument from "@/components/features/subject/EditDocument";
import DeleteDocument from "@/components/features/subject/DeleteDocument";

type Props = {
  schoolId: string;
  document: DocumentType;
  topics: TopicType[];
  subjectId: number;
  user: SchoolUserType;
};

export default function DocumentItem({
  schoolId,
  document,
  topics,
  subjectId,
  user,
}: Props) {
  return (
    <div className="group flex items-center justify-between px-4 py-2">
      <div className="group ml-5 flex items-center gap-3">
        <FileText className="text-muted-foreground size-4 shrink-0" />
        <Link
          href={document.url}
          className="hover:text-primary flex items-center gap-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center gap-1">
            <span className="line-clamp-1 text-base font-medium">
              {document.name}
            </span>
            <SquareArrowOutUpRight className="text-primary size-3.5" />
          </div>
        </Link>
        <Badge variant="outline" className="gap-1 text-xs">
          <FileText className="size-3" />
          {document.format}
        </Badge>
      </div>
      {user.role !== "STUDENT" && (
        <div className="flex items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100">
          <EditDocument
            schoolId={schoolId}
            subjectId={subjectId}
            document={document}
            topics={topics}
          />
          <DeleteDocument
            schoolId={schoolId}
            subjectId={subjectId}
            document={document}
          />
        </div>
      )}
    </div>
  );
}
