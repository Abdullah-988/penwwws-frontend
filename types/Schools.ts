import { SchoolType } from "./School";

export type SchoolsType = {
  joined: {
    school: SchoolType;
  }[];

  pending: {
    school: SchoolType;
  }[];
};
