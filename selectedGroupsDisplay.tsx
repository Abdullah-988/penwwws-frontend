import { Badge } from "@/components/ui/badge";

type SelectedGroupsDisplayProps = {
  groupIds: number[];
  groupNameMap: Map<number, string>;
};

export default function SelectedGroupsDisplay({
  groupIds,
  groupNameMap,
}: SelectedGroupsDisplayProps) {
  const MAXVISIBLE = 2;

  if (groupIds.length === 0) {
    return (
      <span className="text-muted-foreground text-sm">Filter by Group</span>
    );
  }

  const visibleGroups = groupIds.slice(0, MAXVISIBLE);
  const hiddenCount = groupIds.length - MAXVISIBLE;

  return (
    <div className="flex flex-1 items-center gap-1 overflow-hidden">
      {visibleGroups.map((id) => (
        <Badge
          key={id}
          variant="secondary"
          className="bg-primary/10 text-primary max-w-[120px] truncate text-xs"
        >
          {groupNameMap.get(id)}
        </Badge>
      ))}
      {hiddenCount > 0 && (
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary text-xs"
        >
          +{hiddenCount}
        </Badge>
      )}
    </div>
  );
}
