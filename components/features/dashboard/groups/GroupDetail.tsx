"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlignJustify } from "lucide-react";
import { GroupType } from "@/types/Group";
import GroupMembersTable from "./group-members-table";
import { MemberType } from "@/types/member";
import { Button } from "@/components/ui/button";

type Props = {
  schoolId: string;
  group: GroupType;
  data: MemberType[];
};

export default function GroupDetail({ schoolId, group, data }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="hover:bg-primary/15 bg-blue-800/10 text-blue-800"
          size="sm"
          variant="outline"
        >
          <AlignJustify size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[60rem]">
        <DialogHeader>
          <DialogTitle>{group.name} detail</DialogTitle>
          <DialogDescription>
            here you can assign and un assign groups
          </DialogDescription>
        </DialogHeader>
        <div className="w-full overflow-scroll p-1">
          <GroupMembersTable schoolId={schoolId} group={group} data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
