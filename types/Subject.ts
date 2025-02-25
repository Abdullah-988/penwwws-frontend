import { UserType } from "./User";

export type SubjectType = {
  id: string;
  name: string;
  imageUrl: string;
  schoolId: string;
  teachers: UserType[];
  createdAt: string;
  updatedAt: string;
};
