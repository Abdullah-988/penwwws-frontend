"use client";

import { SubjectDetailType } from "@/types/Subject";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SchoolUserType } from "@/types/SchoolUser";
import { TopicType } from "@/types/Topic";
import { useState } from "react";
import TopicTitle from "./TopicTitle";
import DeleteTopic from "@/components/features/subject/DeleteTopic";
import DocumentItem from "@/components/features/subject/DocumentItem";
import UploadDocument from "@/components/features/subject/UploadDocument";

type Props = {
  topics: TopicType[];
  schoolId: string;
  subject: SubjectDetailType;
  user: SchoolUserType;
};

export default function TopicsList({ schoolId, subject, user, topics }: Props) {
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);

  return (
    <Accordion type="multiple" className="mt-6 w-full">
      {topics.map((topic) => (
        <AccordionItem key={topic.id} value={topic.id.toString()}>
          <div className="group flex h-14 items-center justify-between rounded-md px-3">
            <AccordionTrigger className="p-0">
              <div className="flex items-center">
                <TopicTitle
                  schoolId={schoolId}
                  user={user}
                  subject={subject}
                  topic={topic}
                  editingTopicId={editingTopicId}
                  setEditingTopicId={setEditingTopicId}
                />
              </div>
            </AccordionTrigger>
            {user.role !== "STUDENT" && (
              <div className="flex items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100">
                <DeleteTopic
                  schoolId={schoolId}
                  subjectId={subject.id}
                  topic={topic}
                />
                <UploadDocument
                  schoolId={schoolId}
                  subjectId={subject.id}
                  topic={topic}
                />
              </div>
            )}
          </div>

          <AccordionContent>
            {topic.documents.length === 0 ? (
              <div className="text-md text-muted-foreground ml-2 flex h-12 w-full items-center justify-start rounded-md px-4 font-medium">
                No documents uploaded yet.
              </div>
            ) : (
              topic.documents.map((document) => (
                <DocumentItem
                  key={document.id}
                  schoolId={schoolId}
                  subjectId={subject.id}
                  document={document}
                  topics={topics}
                  user={user}
                />
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
