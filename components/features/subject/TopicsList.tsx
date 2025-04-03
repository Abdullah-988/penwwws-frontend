"use client";

import { SubjectDetailType } from "@/types/Subject";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { SchoolUserType } from "@/types/SchoolUser";
import { FileText } from "lucide-react";
import Link from "next/link";
import { TopicType } from "@/types/Topic";
import TopicTitle from "./TopicTitle";
import { useState } from "react";
import DeleteDocument from "./DeleteDocument";

type Props = {
  topics: TopicType[];
  schoolId: string;
  subject: SubjectDetailType;
  user: SchoolUserType;
};

export default function TopicsList({ schoolId, subject, user, topics }: Props) {
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);

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
              <AccordionContent
                key={document.id}
                className="text-md group hover:bg-primary/5 ml-2 flex h-12 w-full cursor-default items-center justify-between rounded-md px-4 font-medium"
              >
                <Link
                  href={document.url}
                  className="flex cursor-pointer items-center gap-2 py-2 text-lg hover:underline"
                >
                  <FileText className="text-muted-foreground" size={16} />
                  <div>
                    {document.name}.
                    <small className="p-0 font-normal">{document.format}</small>
                  </div>
                </Link>
                {user.role !== "STUDENT" && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                    <DeleteDocument
                      schoolId={schoolId}
                      subjectId={subject.id}
                      topicId={topic.id}
                      document={document}
                    />
                  </div>
                )}
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>{" "}
    </div>
  );
}
