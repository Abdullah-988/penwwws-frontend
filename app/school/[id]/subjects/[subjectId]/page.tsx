import DocumentsTab from "@/components/features/subject/Documents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { subjectDetailType } from "@/types/Subject";

export async function getSubject(schoolId: string, subjectId: number) {
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
  const subject: subjectDetailType = await getSubject(schoolId, subjectId);

  console.log(subject);
  return (
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
  );
}
