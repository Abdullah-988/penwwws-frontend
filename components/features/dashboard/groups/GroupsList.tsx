"use client";

import { Accordion } from "@/components/ui/accordion";
import GroupItem from "@/components/features/dashboard/groups/GroupItem";
import { GroupType } from "@/types/Group";
import { MemberType } from "@/types/member";
type Props = {
  groups: GroupType[];
  data: MemberType[];
  schoolId: string;
};

export default function GroupList({ groups }: Props) {
  //TODO: Add default image url value

  if (groups.length === 0) return <div>No groups yet</div>;

  return (
    <Accordion type="multiple">
      {groups.map((group) => (
        <GroupItem key={group.id} group={group} />
      ))}
    </Accordion>
  );
}
