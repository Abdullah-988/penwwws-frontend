"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircle as SpinnerIcon } from "lucide-react";
import { Plus } from "lucide-react";
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
  FormMessage,
} from "@/components/ui/form";
import { AxiosError } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";

const addTableRowSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  max: z
    .number()
    .nonnegative("Maximum value must be a non-negative number.")
    .min(1, "Please provide a max value"),
  count: z.boolean(),
});

type FormData = z.infer<typeof addTableRowSchema>;

type Props = {
  schoolId: string;
  subjectId: number;
};

export default function AddTableRow({ schoolId, subjectId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(addTableRowSchema),
    defaultValues: {
      name: "",
      max: undefined,
      count: false,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onSubmit(data: FormData) {
    const token = await getCookie("token");
    try {
      await axios.post(`/school/${schoolId}/subject/${subjectId}/table`, data, {
        headers: { Authorization: token },
      });
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error adding subject:", error.response?.data);
      toast({
        title: "Table row Add Failed",
        description:
          (error.response?.data as string) || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      form.reset();
    }
  }, [isModalOpen, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus size={10} />
          New Row
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add table row</DialogTitle>
            </DialogHeader>

            <FormField
              name="count"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <FormMessage />
                      <div className="items-top flex space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms1"
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include this row in total calculation
                          </label>
                          <p className="text-muted-foreground text-sm">
                            This row will be included in the total calculation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Table className="rounded-md border">
              <TableHeader className="bg-muted/20 border border-t">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[70%] px-6 py-4 text-sm font-semibold">
                    Activity Name
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right text-sm font-semibold">
                    Grades
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="w-full">
                  <TableCell
                    className={clsx({
                      "border-l-primary bg-primary/10 hover:bg-primary/10 border-l-2":
                        form.getValues("count"),
                    })}
                  >
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div>
                              <FormMessage />
                              <Input
                                className="w-40 border-0 shadow focus-visible:ring-1"
                                placeholder="Name"
                                type="text"
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell
                    className={clsx({
                      "bg-primary/10 hover:bg-primary/10":
                        form.getValues("count"),
                    })}
                  >
                    <FormField
                      name="max"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div>
                              <FormMessage />
                              <Input
                                className="border-0 text-center shadow focus-visible:ring-1"
                                type="number"
                                placeholder="value"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <DialogFooter>
              <Button
                onClick={() => setIsModalOpen(false)}
                disabled={form.formState.isSubmitting}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? <SpinnerIcon /> : "Add Row"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
