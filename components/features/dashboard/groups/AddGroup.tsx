"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle as SpinnerIcon, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { Form } from "@/components/ui/form";
import { AxiosError } from "axios";
import { groupSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuGroupItem } from "@/components/shared/DropdownMenuGroupItem";
import { GroupType } from "@/types/Group";
import GroupFormFields from "./GroupFormFields";
import { GroupFormData } from "@/lib/validations";

type Props = {
  schoolId: string;
  groups: GroupType[];
};

export default function AddGroup({ schoolId, groups }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const flattenGroups = (groups: GroupType[]): GroupType[] =>
    groups.flatMap((g) => [g, ...flattenGroups(g.children ?? [])]);

  const flatGroups = groups ? flattenGroups(groups) : [];
  const groupNameMap = new Map(flatGroups.map((g) => [g.id, g.name]));

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      parentId: null,
    },
  });

  function toggleGroup(groupId: number) {
    setSelectedGroupIds([groupId]);
    form.setValue("parentId", groupId);
  }

  async function onSubmit(data: GroupFormData) {
    const token = await getCookie("token");
    try {
      await axios.post(`/school/${schoolId}/group`, data, {
        headers: { Authorization: token },
      });
      router.refresh();
      setIsModalOpen(false);
      form.reset();
      toast({
        title: "Group Added",
        description: `The group ${data.name} has been added.`,
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error adding group:", error.response?.data);
      toast({
        title: "Group Add Failed",
        description:
          (error.response?.data as string) || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    setSelectedGroupIds([]);
    form.reset();
  }, [isModalOpen, form]);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="px-4 text-sm">
          <Plus size={10} />
          New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add group</DialogTitle>
              <DialogDescription>
                Enter a group name to create a new group. Optionally, select a
                parent group to make it a subgroup.
              </DialogDescription>
            </DialogHeader>
            <GroupFormFields
              groupNameMap={groupNameMap}
              form={form}
              groups={groups}
            />
            <DropdownMenu>
              <DropdownMenuContent className="w-96">
                {groups &&
                  groups.map((group) => (
                    <DropdownMenuGroupItem
                      key={group.id}
                      group={group}
                      selectedGroupIds={selectedGroupIds}
                      handleGroupClick={toggleGroup}
                    />
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              size="sm"
              className="w-full"
            >
              {form.formState.isSubmitting ? (
                <SpinnerIcon className="animate-spin" />
              ) : (
                "Add Group"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
