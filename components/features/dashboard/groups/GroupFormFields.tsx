import { Input } from "@/components/ui/input";
import { ChevronDown, X } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuGroupItem } from "@/components/shared/DropdownMenuGroupItem";
import { GroupType } from "@/types/Group";
import { GroupFormData } from "@/lib/validations";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<GroupFormData>;
  groups: GroupType[];
  groupNameMap: Map<number, string>;
};
export default function GroupFormFields({ form, groups, groupNameMap }: Props) {
  function toggleGroup(groupId: number) {
    form.setValue("parentId", groupId);
  }

  return (
    <>
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">Group name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="e.g., Stage 1, Class A, Section B"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="parentId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">
              Parent group (Optional)
            </FormLabel>
            <FormControl>
              <DropdownMenu>
                <div className="group relative w-full">
                  <DropdownMenuTrigger className="hover:border-primary flex w-full items-center justify-between rounded-md border p-2">
                    <span className="text-sm">
                      {field.value && field.value > 0 ? (
                        <span>{groupNameMap.get(field.value)}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          Select a group
                        </span>
                      )}
                    </span>
                    <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
                  </DropdownMenuTrigger>

                  {field.value && field.value > 0 && (
                    <button
                      type="button"
                      className="absolute top-1/2 right-10 -translate-y-1/2 transform opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        form.setValue("parentId", null);
                      }}
                      aria-label="Clear selection"
                    >
                      <X className="text-muted-foreground h-4 w-4" />
                    </button>
                  )}
                </div>
                <DropdownMenuContent className="w-96">
                  {groups && groups?.length > 0 ? (
                    groups.map((group) => (
                      <DropdownMenuGroupItem
                        key={group.id}
                        group={group}
                        selectedGroupIds={field.value ? [field.value] : []}
                        handleGroupClick={toggleGroup}
                      />
                    ))
                  ) : (
                    <span className="text-muted-foreground p-2 text-sm">
                      No groups
                    </span>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
