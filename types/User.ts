export type UserType = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};
