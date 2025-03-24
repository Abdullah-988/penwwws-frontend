import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GroupType } from "@/types/Group";
import { Users } from "lucide-react";
import GroupDetail from "@/components/features/dashboard/groups/GroupDetail";
import DeleteGroup from "@/components/features/dashboard/groups/DeleteGroup";
import { MemberType } from "@/types/member";

type Props = {
  group: GroupType;
  data: MemberType[];
  schoolId: string;
};

export default function GroupItem({ group, data, schoolId }: Props) {
  const hasChildren = group.children && group.children.length > 0;

  return (
    <>
      {hasChildren ? (
        <AccordionItem value={String(group.id)}>
          <div className="text-md group hover:bg-primary/5 ml-2 flex h-12 w-full items-center justify-start rounded-md px-4 font-medium">
            {" "}
            <AccordionTrigger className="md p-0">
              {" "}
              <div className="flex items-center gap-1">
                <Users className="text-primary size-4" />
                {group.name}
              </div>
            </AccordionTrigger>
            <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100">
              <>
                {" "}
                <DeleteGroup schoolId={schoolId} group={group} />
                <GroupDetail schoolId={schoolId} data={data} group={group} />
              </>
            </div>
          </div>

          <AccordionContent className="border-primary/30 text-md ml-4 border-l">
            {group.children &&
              group.children.map((child) => (
                <GroupItem
                  key={child.id}
                  group={child}
                  data={data}
                  schoolId={schoolId}
                />
              ))}
          </AccordionContent>
        </AccordionItem>
      ) : (
        <div className="text-md group hover:bg-primary/5 ml-2 flex h-12 w-full cursor-default items-center justify-between rounded-md px-4 font-medium">
          <div className="flex items-center gap-1">
            <Users className="text-primary size-4" />
            {group.name}
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
            <DeleteGroup schoolId={schoolId} group={group} />
            <GroupDetail schoolId={schoolId} data={data} group={group} />
          </div>
        </div>
      )}
    </>
  );
}
