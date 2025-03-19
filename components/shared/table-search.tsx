import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

type Props = {
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
};
export const TableSearch = ({ globalFilter, setGlobalFilter }: Props) => {
  return (
    <div className="w-96 py-6">
      <Input
        placeholder="Search by id, name or email"
        value={globalFilter}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
        }}
      />
    </div>
  );
};
