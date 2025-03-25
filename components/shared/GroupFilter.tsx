"use client";

import { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import { GroupType } from "@/types/Group";
import { MemberType } from "@/types/member";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/fetches/groups";
import { DropdownMenuGroupItem } from "@/components/shared/DropdownMenuGroupItem";
import SelectedGroupsDisplay from "@/components/shared/SelectedGroupsDisplay";

type GroupFilterProps = {
  table: Table<MemberType>;
  schoolId: string;
  defaultFilteredGroupIds: number[];
};

// Order all groups in a flat array (no nested groups)
const flattenGroups = (groups: GroupType[]): GroupType[] =>
  groups.flatMap((g) => [g, ...flattenGroups(g.children ?? [])]);

export const GroupFilter = ({
  table,
  defaultFilteredGroupIds = [],
  schoolId,
}: GroupFilterProps) => {
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>(
    defaultFilteredGroupIds,
  );
  const { data: groups } = useQuery<GroupType[]>({
    queryKey: ["groups", schoolId],
    queryFn: () => getGroups(schoolId),
  });

  const flatGroups = groups ? flattenGroups(groups) : [];
  const groupNameMap = new Map(flatGroups.map((g) => [g.id, g.name]));

  useEffect(() => {
    table
      .getColumn("groups")
      ?.setFilterValue(
        selectedGroupIds.length > 0 ? selectedGroupIds : undefined,
      );
  }, [selectedGroupIds, table]);

  const toggleGroup = (groupId: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const clearFilters = () => setSelectedGroupIds([]);

  return (
    <DropdownMenu>
      <div className="flex w-fit items-center gap-1 rounded-md border shadow-xs">
        {selectedGroupIds.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-destructive bg-destructive/10 ml-2 flex h-6 w-7 items-center justify-center rounded-md"
            aria-label="Clear filters"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}

        <DropdownMenuTrigger asChild>
          <div className="flex h-9 flex-1 cursor-pointer items-center justify-between gap-2 px-3">
            <SelectedGroupsDisplay
              groupIds={selectedGroupIds}
              groupNameMap={groupNameMap}
            />
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent className="w-56">
        {groups && groups?.length > 0 ? (
          groups.map((group) => (
            <DropdownMenuGroupItem
              key={group.id}
              group={group}
              selectedGroupIds={selectedGroupIds}
              handleGroupClick={toggleGroup}
            />
          ))
        ) : (
          <span className="text-muted-foreground p-2 text-sm">No groups</span>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
