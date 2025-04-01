import DocumentsTab from "@/components/features/subject/Documents";
import SubjectPageHeader from "@/components/features/subject/SubjectPageHeader";
import Navbar from "@/components/shared/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { SubjectDetailType } from "@/types/Subject";

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

  return (
    <>
      <Navbar schoolId={schoolId} />
      <div className="mt-3 px-3 md:mt-6 md:px-20">
        <SubjectPageHeader subject={subject} />
        <Tabs defaultValue="documents">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="marks">Marks table</TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            <DocumentsTab schoolId={schoolId} subjectId={subjectId} />
          </TabsContent>
          <TabsContent value="students">Students</TabsContent>
          <TabsContent value="marks">Marks table</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
