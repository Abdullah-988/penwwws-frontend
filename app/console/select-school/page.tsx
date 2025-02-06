import Link from "next/link";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { CircleAlert as AlertIcon } from "lucide-react";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";

type SchoolType = {
  school: {
    id: number;
    name: string;
    logoUrl: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

async function getSchools() {
  try {
    const token = await getCookie("token", { cookies });
    const res = await axios("/school", {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(error.response?.data || "Unexpected error accrued");
  }
}

export default async function SelectSchool() {
  const schoolsList: SchoolType[] = await getSchools();

  if (!schoolsList) return;

  if (schoolsList.length === 0) {
    return (
      <div className="mt-8 space-y-8">
        <div className="border-border bg-primary/15 text-primary flex items-center gap-2 rounded-md border p-2 text-sm">
          <AlertIcon className="h-5 w-5" />
          You're not part of any school yet.
        </div>
        <div className="text-muted-foreground flex items-center gap-1">
          <p>Join one with an invitation or</p>
          <Link className="text-primary" href="/console/create-school">
            Create a school
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="flex w-full flex-col items-start justify-between gap-8">
      <h1 className="text-primary text-lg font-semibold">Select a school</h1>

      <div className="flex max-h-80 w-full flex-col items-center gap-3 self-center overflow-scroll">
        {schoolsList.map(({ school }) => (
          <Link
            key={school.id}
            href={`/school/${school.id}`}
            className="text-primary bg-primary/15 hover:bg-primary/20 w-full rounded-md p-2 text-center font-semibold duration-150"
          >
            {school.name}
          </Link>
        ))}
      </div>

      <Link className="text-primary" href="/console/create-school">
        Create new school
      </Link>
    </section>
  );
}
