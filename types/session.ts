export type SessionType = {
  id: number;
  name: string;
  subjectId: number;
  expirationDate: string;
  _count: { attenders: number };
  attended?: boolean;
  createdAt: string;
  updatedAt: string;
};
