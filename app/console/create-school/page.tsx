"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import axios from "@/lib/axiosInstance";
import { useForm } from "react-hook-form";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleAlert as AlertIcon } from "lucide-react";
import { LoaderCircle as SpinnerIcon } from "lucide-react";
import Link from "next/link";

const createSchoolFormSchema = z.object({
  schoolName: z.string().nonempty(),
});

type formDataType = z.infer<typeof createSchoolFormSchema>;

export default function CreateSchoolForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<formDataType>({
    defaultValues: { schoolName: "" },
    resolver: zodResolver(createSchoolFormSchema),
  });

  async function handleCreateSchool(formData: formDataType) {
    try {
      const token = await getCookie("token");
      const res = await axios.post(
        "/school",
        { name: formData.schoolName },
        {
          headers: { Authorization: token },
        },
      );

      //TODO:Update redirect path
      router.push(`/school/${res.data.name}`);
    } catch (err) {
      const error = err as AxiosError;
      toast({
        variant: "destructive",
        title: "Could not create your school",
        description:
          (error?.response?.data as string) ||
          "Unexpected error accrued while creating your school",
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-8"
          onSubmit={form.handleSubmit(handleCreateSchool)}
        >
          <h1 className="text-primary text-lg font-semibold">
            Create Your School
          </h1>
          <FormField
            name="schoolName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="School name"
                    className="border-border text-primary h-12 border"
                  />
                </FormControl>{" "}
                {!form.formState.isDirty && (
                  <div className="border-border bg-primary/15 text-primary mt-8 flex items-center gap-2 rounded-md border p-2 text-sm">
                    <AlertIcon className="h-5 w-5" />
                    School name must be provided
                  </div>
                )}
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="w-full font-semibold disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting ? (
              <SpinnerIcon className="animate-spin" size={25} />
            ) : (
              <span>Create school</span>
            )}
          </Button>
        </form>
      </Form>
      <Link className="text-primary mt-4" href="/console/select-school">
        View your existing schools
      </Link>
    </>
  );
}
