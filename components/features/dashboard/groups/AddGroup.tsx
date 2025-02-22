"use client";

import { useState } from "react";
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
import SelectGroupField from "./SelectGroupField";
import { Input } from "@/components/ui/input";
import { LoaderCircle as SpinnerIcon, Plus } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { addGroupSchema } from "@/lib/validations";
type FormData = z.infer<typeof addGroupSchema>;

type Props = {
  schoolId: string;
};

export default function AddGroup({ schoolId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(addGroupSchema),
    defaultValues: {
      name: "",
      parentId: null,
    },
  });

  async function onSubmit(data: FormData) {
    const token = await getCookie("token");
    try {
      await axios.post(`/school/${schoolId}/group`, data, {
        headers: { Authorization: token },
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
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

            <SelectGroupField form={form} schoolId={schoolId} />

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              size="sm"
              className="w-full rounded-full font-semibold"
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
