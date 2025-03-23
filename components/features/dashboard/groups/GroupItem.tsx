import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GroupType } from "@/types/Group";
import { Users } from "lucide-react";

type Props = {
  group: GroupType;
};

export default function GroupItem({ group }: Props) {
  const hasChildren = group.children && group.children.length > 0;
  return (
    <>
      {hasChildren ? (
        <AccordionItem className="ml-5" value={String(group.id)}>
          <AccordionTrigger className="text-md flex w-full items-center justify-between rounded-md font-medium">
            <div className="flex items-center gap-1">
              <Users className="text-primary size-4" />
              {group.name}
            </div>
            <span className="text-muted-foreground ml-auto text-xs">
              {group._count.members} members
            </span>
          </AccordionTrigger>
          <AccordionContent className="border-primary/30 text-md border-l">
            {group.children &&
              group.children.map((child) => (
                <GroupItem key={child.id} group={child} />
              ))}
          </AccordionContent>
        </AccordionItem>
      ) : (
        <div className="text-md hover:bg-primary/10 ml-5 flex items-center justify-between rounded-md p-3 font-medium">
          <div className="flex items-center gap-1">
            <Users className="text-primary size-4" />
            {group.name}
          </div>
          <span className="text-muted-foreground text-xs">
            {group._count.members} members
          </span>
        </div>
      )}
    </>
  );
}
