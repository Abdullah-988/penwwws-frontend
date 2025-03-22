// components/shared/members-table.tsx
"use client";

import { DataTable } from "@/components/shared/data-table";
import { getColumns, MemberType } from "@/components/shared/columns";

type Props = {
  data: MemberType[];
  schoolId: string;
};
export const MembersTable = ({ data, schoolId }: Props) => {
  return (
    <DataTable columns={getColumns(schoolId)} data={data} schoolId={schoolId} />
  );
};
