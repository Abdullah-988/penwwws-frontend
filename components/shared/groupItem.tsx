import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { GroupType } from "@/types/Group";

type GroupItemProps = {
  group: GroupType;
  selectedGroupIds: number[];
  handleGroupClick: (groupId: number) => void;
};

export function GroupItem({
  group,
  selectedGroupIds,
  handleGroupClick,
}: GroupItemProps) {
  const hasChildren = group.children && group.children.length > 0;
  const isSelected = selectedGroupIds.includes(group.id);

  return (
    <>
      {hasChildren ? (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full cursor-pointer">
            <div
              className="flex w-full items-center justify-between"
              onClick={() => handleGroupClick(group.id)}
            >
              <span>{group.name}</span>
              <div className="flex items-center gap-2">
                {isSelected && <Check className="text-primary h-4 w-4" />}
              </div>
            </div>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            {group.children &&
              group.children.map((child) => (
                <GroupItem
                  key={child.id}
                  group={child}
                  selectedGroupIds={selectedGroupIds}
                  handleGroupClick={handleGroupClick}
                />
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      ) : (
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleGroupClick(group.id)}
        >
          <div className="flex w-full items-center justify-between">
            <span>{group.name}</span>
            {isSelected && <Check className="text-primary ml-2 h-4 w-4" />}
          </div>
        </DropdownMenuItem>
      )}
    </>
  );
}
