"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlignJustify, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GroupType } from "@/types/Group";
import GroupMembersTable from "@/components/features/dashboard/groups/GroupMembersTable";
import { MemberType } from "@/types/member";
import { Button } from "@/components/ui/button";

type Props = {
  schoolId: string;
  group: GroupType;
  data: MemberType[];
};

export default function GroupDetails({ schoolId, group, data }: Props) {
  const memberCount = new Intl.NumberFormat("en-IN").format(
    group._count.members,
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-800/10 text-blue-800 hover:bg-blue-800/15"
          size="sm"
          variant="outline"
        >
          <AlignJustify size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[60rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            {group.name}{" "}
            <Badge variant="outline" className="text-sm">
              <Users className="text-primary" />
              {memberCount} <span>member(s)</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full overflow-scroll p-1">
          <GroupMembersTable schoolId={schoolId} group={group} data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
