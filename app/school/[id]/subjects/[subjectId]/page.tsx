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
import Link from "next/link";

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
  searchParams,
}: {
  params: Promise<{ id: string; subjectId: number }>;
  searchParams: Promise<{ tab?: "document" }>;
}) {
  const schoolId = (await params).id;
  const subjectId = (await params).subjectId;
  const subject: SubjectDetailType = await getSubject(schoolId, subjectId);
  const user = await getUser(schoolId);
  const subjectTabs = getSubjectTabs(schoolId, subject, user);
  const activeTab = (await searchParams).tab || "documents";

  return (
    <>
      <Navbar user={user} schoolId={schoolId} />
      <div className="mt-3 p-6 md:mt-6">
        <SubjectPageHeader subject={subject} schoolId={schoolId} user={user} />
        <Tabs value={activeTab} className="mt-12 w-full">
          <div className="relative w-full">
            <TabsList className="scrollbar-hide bg-background z-10 flex h-10 w-full items-center justify-start overflow-x-auto rounded-none border-b p-0">
              {subjectTabs.map((tab) => (
                <TabsTrigger
                  className="data-[state=active]:border-b-foreground text-muted-foreground data-[state=active]:text-foreground relative z-0 w-fit flex-shrink-0 flex-grow-0 rounded-none border-b-2 border-transparent px-3 py-2 text-sm last:z-50 data-[state=active]:shadow-none"
                  key={tab.value}
                  value={tab.value}
                  asChild
                >
                  <Link href={`?tab=${tab.value}`} scroll={false}>
                    <tab.icon />
                    {tab.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="pointer-events-none absolute top-0 right-0 z-20 my-auto h-[90%] w-20 bg-gradient-to-l from-white to-transparent" />
          </div>

          <div className="w-full">
            {subjectTabs.map((tab) => (
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
