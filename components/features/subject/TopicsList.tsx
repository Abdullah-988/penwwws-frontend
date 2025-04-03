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
import { TopicType } from "@/types/TopicType";
import TopicTitle from "./TopicTitle";
import { useState } from "react";

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
      <Accordion type="single" collapsible className="mt-4 w-full">
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.name}>
            <TopicTitle
              schoolId={schoolId}
              user={user}
              topic={topic}
              editingTopicId={editingTopicId}
              setEditingTopicId={setEditingTopicId}
            />
            {topic.documents.map((document) => (
              <AccordionContent
                key={document.id}
                className="text-md ml-10 flex flex-col gap-2"
              >
                <Link
                  href={document.url}
                  className="flex cursor-pointer items-center gap-2 py-2 text-lg hover:underline"
                >
                  <FileText size={16} />
                  {document.name}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>{" "}
    </div>
  );
}
