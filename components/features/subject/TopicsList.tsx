"use client";

import { SubjectDetailType } from "@/types/Subject";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { SchoolUserType } from "@/types/SchoolUser";
import { TopicType } from "@/types/Topic";
import TopicTitle from "./TopicTitle";
import { useState } from "react";
import DocumentTitle from "@/components/features/subject/DocumentTitle";

type Props = {
  topics: TopicType[];
  schoolId: string;
  subject: SubjectDetailType;
  user: SchoolUserType;
};

export default function TopicsList({ schoolId, subject, user, topics }: Props) {
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(
    null,
  );

  return (
    <div>
      <Accordion type="multiple" className="mt-4 w-full">
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.name}>
            <TopicTitle
              schoolId={schoolId}
              user={user}
              subject={subject}
              topic={topic}
              editingTopicId={editingTopicId}
              setEditingTopicId={setEditingTopicId}
            />

            {topic.documents.map((document) => (
              <DocumentTitle
                key={document.id}
                schoolId={schoolId}
                subjectId={subject.id}
                document={document}
                topicId={topic.id}
                editingDocumentId={editingDocumentId}
                setEditingDocumentId={setEditingDocumentId}
                user={user}
              />
            ))}
          </AccordionItem>
        ))}
      </Accordion>{" "}
    </div>
  );
}
