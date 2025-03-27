"use client";

import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { SchoolType } from "@/types/School";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editSchoolSchema } from "@/lib/validations";
import z from "zod";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  school: SchoolType;
};

type FormData = z.infer<typeof editSchoolSchema>;

export default function EditSchool({ school }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<FormData>({
    defaultValues: {
      name: school.name,
      description: school.description,
      logoUrl: school.logoUrl,
    },
    resolver: zodResolver(editSchoolSchema),
  });

  async function onsubmit(data: FormData) {
    try {
      const token = await getCookie("token");
      await axios.put(
        `/school/${school.id}`,
        {
          logoUrl: data.logoUrl || "",
          name: data.name,
          description: data.description || "",
        },
        {
          headers: { Authorization: token },
        },
      );
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["schools"],
      });

      toast({
        title: "School updated",
        description: "The school details have been successfully updated.",
      });

      form.reset(data, { keepDirty: false });
    } catch (err) {
      const error = err as AxiosError;

      console.error(
        (error.response && (error.response.data as string)) ||
          "Unexpected error occur",
      );

      toast({
        title: "could not edit school",
        description:
          (error.response && (error.response.data as string)) ||
          "Unexpected error occur",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    form.reset({
      name: school.name,
      description: school.description,
      logoUrl: school.logoUrl,
    });
  }, [school, form]);

  return (
    <section className="rounded-md">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onsubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <h1 className="text-md font-semibold">Name</h1>
                <FormMessage />
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <h1 className="text-md font-semibold">Description</h1>
                <FormMessage />
                <FormControl>
                  <Textarea className="bg-card h-36 resize-none" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="ml-auto flex w-fit items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              type="button"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              onClick={() => {
                router.refresh();
                form.reset();
              }}
              className="rounded-full"
            >
              Cancel
            </Button>

            <Button
              size="sm"
              className="rounded-full"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {form.formState.isSubmitting ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <span>Save</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
