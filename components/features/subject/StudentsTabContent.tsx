import { SubjectDetailType } from "@/types/Subject";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
};

export default function StudentsTabContent({ schoolId, subject }: Props) {
  console.log(schoolId, subject);
  return <div>StudentsTabContent</div>;
}
