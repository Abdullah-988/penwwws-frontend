export type GroupType = {
  id: number;
  name: string;
  parentId: number;
  schoolId: string;
  _count: { members: number };
  children?: GroupType[];
  createdAt: string;
  updatedAt: string;
};
