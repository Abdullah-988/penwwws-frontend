import Navbar from "@/components/shared/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { SubjectDetailType } from "@/types/Subject";
import SubjectPageHeader from "@/components/features/subject/SubjectPageHeader";
import { getSubjectTabs } from "@/constants/subjectTabs";
import { getUser } from "@/fetches/schoolUser";

async function getSubject(schoolId: string, subjectId: number) {
  try {
    const token = await getCookie("token", { cookies });

    const res = await axios.get(`/school/${schoolId}/subject/${subjectId}`, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(error.response?.data || "Unexpected error occurred");
  }
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string; subjectId: number }>;
}) {
  const schoolId = (await params).id;
  const subjectId = (await params).subjectId;
  const subject: SubjectDetailType = await getSubject(schoolId, subjectId);
  const user = await getUser(schoolId);
  const SUBJECT_TABS = getSubjectTabs(schoolId, subject, user);
  return (
    <>
      <Navbar user={user} schoolId={schoolId} />
      <div className="mt-3 p-6 md:mt-6">
        <SubjectPageHeader subject={subject} schoolId={schoolId} user={user} />
        <Tabs defaultValue="documents" className="mt-12 w-full">
          <TabsList className="bg-background flex h-10 w-full items-center justify-start gap-4 rounded-none border-b p-0">
            {SUBJECT_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:border-b-foreground text-muted-foreground data-[state=active]:text-foreground w-20 flex-shrink-0 flex-grow-0 rounded-none border-b-2 border-transparent px-3 py-2 text-sm data-[state=active]:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="w-full">
            {SUBJECT_TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </>
  );
}
