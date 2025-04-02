import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { getMembers } from "@/fetches/member";
import { SubjectDetailType } from "@/types/Subject";
import AssignSubjectMembersTable from "@/components/features/subject/AssignSubjectMemberTable";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
};

export default async function AddSubjectMembersModal({
  schoolId,
  subject,
}: Props) {
  const members = await getMembers(schoolId);
  const memberCount = formatNumber(members.length);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="md:ml-auto" size="sm">
          <Plus size={20} />
          New member(s)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[60rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            {subject.name}{" "}
            <Badge variant="outline" className="text-sm">
              <Users className="text-primary" />
              {memberCount} <span>member(s)</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <AssignSubjectMembersTable
          schoolId={schoolId}
          members={members}
          subject={subject}
        />
      </DialogContent>
    </Dialog>
  );
}
