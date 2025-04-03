export type DocumentType = {
  id: number;
  name: string;
  url: string;
  assignmentId?: string;
  format: string;
  publicId: string;
  submissionId?: string;
  topicId?: string;
  type: string;
  updatedAt: string;
  createdAt: string;
};

export type TopicType = {
  id: number;
  subjectId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  documents: DocumentType[];
};
