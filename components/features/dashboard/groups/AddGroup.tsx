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
import { Input } from "@/components/ui/input";
import {
  LoaderCircle as SpinnerIcon,
  Plus,
  ChevronDown,
  X,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AxiosError } from "axios";
import { addGroupSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuGroupItem } from "@/components/shared/DropdownMenuGroupItem";
import { GroupType } from "@/types/Group";

type FormData = z.infer<typeof addGroupSchema>;

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

  const form = useForm<FormData>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: "",
      parentId: null,
    },
  });

  function toggleGroup(groupId: number) {
    setSelectedGroupIds([groupId]);
    form.setValue("parentId", groupId);
  }

  async function onSubmit(data: FormData) {
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
        <Button size="sm" className="rounded-full px-4 text-sm font-semibold">
          <Plus size={10} />
          Add Group
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

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Group Name
                  </FormLabel>
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
            <DropdownMenu>
              <FormLabel className="text-muted-foreground">
                Parent group (Optional)
              </FormLabel>
              <div className="group relative w-full">
                <DropdownMenuTrigger className="hover:border-primary flex w-full items-center justify-between rounded-md border p-2">
                  <span className="text-sm">
                    {selectedGroupIds.length > 0 ? (
                      groupNameMap.get(selectedGroupIds[0])
                    ) : (
                      <span className="text-muted-foreground">
                        Select a group
                      </span>
                    )}
                  </span>
                  <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
                </DropdownMenuTrigger>

                {selectedGroupIds.length > 0 && (
                  <button
                    type="button"
                    className="absolute top-1/2 right-10 -translate-y-1/2 transform opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGroupIds([]);
                      form.setValue("parentId", null);
                    }}
                    aria-label="Clear selection"
                  >
                    <X className="text-muted-foreground h-4 w-4" />
                  </button>
                )}
              </div>
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
              className="w-full rounded-full font-semibold"
            >
              {form.formState.isSubmitting ? (
                <SpinnerIcon className="animate-spin" />
              ) : (
                "New Group"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
