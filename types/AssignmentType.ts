import { DocumentType } from "@/types/Document";

export type AssignmentType = {
  id: number;
  title: string;
  deadline: string;
  subjectId: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    submissions: number;
  };
  document?: Omit<DocumentType, "submissionId" | "topicId" | "assignmentId">;
  submission?: {
    id: number;
    assignmentId: number;
    createdAt: string;
    updatedAt: string;
    document?: Omit<DocumentType, "submissionId" | "topicId" | "assignmentId">;
  };
};
