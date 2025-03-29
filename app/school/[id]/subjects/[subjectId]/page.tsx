import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string; schoolId: number }>;
}) {
  const schoolId = (await params).id;
  const subjectId = (await params).schoolId;
  console.log(subjectId, schoolId);
  return (
    <Tabs defaultValue="documents">
      <TabsList>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="marks">Marks table</TabsTrigger>
      </TabsList>
      <TabsContent value="documents">Documents</TabsContent>
      <TabsContent value="students">Students</TabsContent>
      <TabsContent value="marks">Marks table</TabsContent>
    </Tabs>
  );
}
