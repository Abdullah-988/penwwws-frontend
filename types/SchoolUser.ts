import { UserType } from "@/types/User";

export type SchoolUserType = UserType & {
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  isAdmin: true;
};
