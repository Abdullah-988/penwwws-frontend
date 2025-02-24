import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { GroupType } from "@/types/Group";
import { getCookie } from "cookies-next";
import axios from "@/lib/axiosInstance";
import { addGroupSchema } from "@/lib/validations";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type Props = {
  form: UseFormReturn<z.infer<typeof addGroupSchema>>;
  schoolId: string;
};

export default function SelectGroupField({ form, schoolId }: Props) {
  const { data: groups = [], isLoading } = useQuery<GroupType[]>({
    queryKey: ["groups", schoolId],
    queryFn: async () => {
      const token = await getCookie("token");
      const response = await axios.get(`/school/${schoolId}/group`, {
        headers: { Authorization: token },
      });
      return response.data;
    },
  });

  return (
    <FormField
      name="parentId"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-muted-foreground">
            Parent Group (optional)
          </FormLabel>
          <FormControl>
            <Select
              value={field.value?.toString()}
              onValueChange={(value) =>
                field.onChange(value ? Number(value) : null)
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent group" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="null">None</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
