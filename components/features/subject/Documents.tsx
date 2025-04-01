import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";

type Props = {
  schoolId: string;
  subjectId: number;
};

export type Document = {
  id: number;
  title: string;
  files: {
    id: number;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
};

export async function getDocuments(schoolId: string, subjectId: number) {
  try {
    const token = await getCookie("token", { cookies });

    const res = await axios.get(
      `/school/${schoolId}/subject/${subjectId}/documents`,
      {
        headers: { Authorization: token },
      },
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(error.response?.data || "Unexpected error occurred");
  }
}
export default async function DocumentsTab({ schoolId, subjectId }: Props) {
  console.log(schoolId, subjectId);
  return (
    <div className="hidden">
      {/* <Accordion type="single" collapsible className="w-full">
        {mockDocuments.map((document) => (
          <>
            <AccordionItem key={document.title} value={document.title}>
              <AccordionTrigger>{document.title}</AccordionTrigger>
              <AccordionContent>
                {document.files.map((file) => (
                  <h1 key={file.id} className="hover:underline">
                    {file.name}
                  </h1>
                ))}
              </AccordionContent>
            </AccordionItem>
          </>
        ))}
      </Accordion> */}
    </div>
  );
}
