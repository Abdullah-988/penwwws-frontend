import { DocumentType } from "@/types/Document";
export type AssignmentType = {
  id: number;
  title: string;
  deadline: string;
  subjectId: number;
  createdAt: string;
  updatedAt: string;
  documents: Omit<DocumentType, "submissionId" | "topicId" | "assignmentId">[];
};
