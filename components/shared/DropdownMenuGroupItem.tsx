import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { GroupType } from "@/types/Group";
import { MouseEvent } from "react";

type GroupItemProps = {
  group: GroupType;
  selectedGroupIds: number[];
  handleGroupClick: (groupId: number) => void;
};

export function DropdownMenuGroupItem({
  group,
  selectedGroupIds,
  handleGroupClick,
}: GroupItemProps) {
  const hasChildren = group.children && group.children.length > 0;
  const isSelected = selectedGroupIds.includes(group.id);

  function onClick(e: MouseEvent) {
    e.preventDefault();
    handleGroupClick(group.id);
  }

  return (
    <>
      {hasChildren ? (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full cursor-pointer">
            <div
              className="flex w-full items-center justify-between"
              onClick={onClick}
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
                <DropdownMenuGroupItem
                  key={child.id}
                  group={child}
                  selectedGroupIds={selectedGroupIds}
                  handleGroupClick={handleGroupClick}
                />
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      ) : (
        <DropdownMenuItem onClick={onClick} asChild className="cursor-pointer">
          <div className="flex w-full items-center justify-between">
            <span>{group.name}</span>
            {isSelected && <Check className="text-primary ml-2 h-4 w-4" />}
          </div>
        </DropdownMenuItem>
      )}
    </>
  );
}
