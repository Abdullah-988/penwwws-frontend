import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMembers } from "@/fetches/member";
import { SubjectDetailType } from "@/types/Subject";
import AssignSubjectTable from "@/components/features/subject/AssignSubjectTable";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
};

export default async function AddSubjectMembersModal({
  schoolId,
  subject,
}: Props) {
  const members = await getMembers(schoolId);
  const membersToAssign = members.filter((member) => {
    return !subject.users.some((m) => m.id === member.id);
  });
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
          </DialogTitle>
        </DialogHeader>
        <AssignSubjectTable
          schoolId={schoolId}
          members={membersToAssign}
          subject={subject}
        />
      </DialogContent>
    </Dialog>
  );
}
