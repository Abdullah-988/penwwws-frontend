export type DocumentType = {
  id: number;
  name: string;
  url: string;
};

export type TopicType = {
  id: number;
  subjectId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  documents: DocumentType[];
};
