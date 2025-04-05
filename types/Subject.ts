import { MemberType } from "./member";

export type SubjectType = {
  id: number;
  name: string;
  imageUrl: string;
  schoolId: string;
  teachers: MemberType[];
  createdAt: string;
  updatedAt: string;
};

export type SubjectDetailType = Omit<SubjectType, "teachers"> & {
  users: MemberType[] | Omit<MemberType, "groups">[];
};
