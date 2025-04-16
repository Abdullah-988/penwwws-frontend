"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
import { MarksTableFormData } from "@/lib/validations";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<MarksTableFormData>;
};

export default function TableRowFields({ form }: Props) {
  return (
    <>
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
                "bg-primary/10 hover:bg-primary/10": form.getValues("count"),
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
                          {...field}
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
    </>
  );
}
