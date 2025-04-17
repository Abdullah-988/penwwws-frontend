"use client";

import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CircleAlert as AlertIcon,
  LoaderCircle as SpinnerIcon,
  ArrowLeft,
} from "lucide-react";

const createSchoolFormSchema = z.object({
  schoolName: z.string().nonempty(),
});

type formDataType = z.infer<typeof createSchoolFormSchema>;

type Props = {
  setSchoolAction: Dispatch<SetStateAction<"select" | "create">>;
};

export default function CreateSchool({ setSchoolAction }: Props) {
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
        { name: formData.schoolName.trim() },
        {
          headers: { Authorization: token },
        },
      );

      router.push(`/school/${res.data.id}/dashboard`);
    } catch (err) {
      const error = err as AxiosError;
      toast({
        variant: "destructive",
        title: "Could not create your school",
        description:
          (error?.response?.data as string) ||
          "Unexpected error occurred while creating your school",
      });
    }
  }

  return (
    <section className="flex w-full flex-col items-start gap-8">
      <div>
        <h1 className="text-primary text-2xl font-semibold">
          Create your own school on Penwwws
        </h1>
        <p className="text-muted-foreground">
          Creating your school is as simple as providing its name.
        </p>
      </div>
      <Form {...form}>
        <form
          className="bg-primary-600/5 w-full space-y-5 rounded-xl px-5 py-8"
          onSubmit={form.handleSubmit(handleCreateSchool)}
        >
          <FormField
            name="schoolName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="text-primary mb-4 flex w-full items-center gap-2 rounded-sm text-sm">
                  <AlertIcon className="h-5 w-5" />
                  The official name of your school is recommended
                </div>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    placeholder="School name"
                    className="border-border text-primary h-12 w-full border text-sm"
                  />
                </FormControl>{" "}
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="w-full disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting && (
              <SpinnerIcon className="animate-spin" size={25} />
            )}
            <span>Create school</span>
          </Button>
        </form>
      </Form>

      <button
        onClick={() => setSchoolAction("select")}
        className="text-primary flex w-fit items-center gap-2"
      >
        <ArrowLeft className="bg-secondary h-8 w-14 rounded-md p-2" size={20} />
        View your Schools
      </button>
    </section>
  );
}
