import { SubjectDetailType } from "@/types/Subject";
import AddTopic from "@/components/features/subject/AddTopic";
import TopicsList from "@/components/features/subject/TopicsList";
import { SchoolUserType } from "@/types/SchoolUser";

import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
  user: SchoolUserType;
};
async function getTopics(schoolId: string, subjectId: number) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(
    `/school/${schoolId}/subject/${subjectId}/topic`,
    {
      headers: { Authorization: token },
    },
  );
  return res.data;
}

export default async function DocumentsTab({ schoolId, subject, user }: Props) {
  const topics = await getTopics(schoolId, subject.id);
  return (
    <div className="">
      {user.role !== "STUDENT" && (
        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Topics</h1>
          <AddTopic schoolId={schoolId} subject={subject} />
        </div>
      )}
      <TopicsList
        topics={topics}
        schoolId={schoolId}
        subject={subject}
        user={user}
      />
    </div>
  );
}
