import { DocumentType } from "@/types/Document";

export type TopicType = {
  id: number;
  subjectId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  documents: DocumentType[];
};
