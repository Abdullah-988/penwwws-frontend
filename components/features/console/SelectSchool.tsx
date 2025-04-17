"use client";

import { Dispatch, SetStateAction } from "react";
import { deleteCookie } from "cookies-next";
import { getSchools } from "@/fetches/schools";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { LoaderCircle as SpinnerIcon, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getRoleRedirectPath } from "@/lib/utils";
import { SchoolsType } from "@/types/Schools";

type Props = {
  setSchoolAction: Dispatch<SetStateAction<"select" | "create">>;
};

export default function SelectSchool({ setSchoolAction }: Props) {
  const router = useRouter();
  const { data: schools, isLoading } = useQuery<SchoolsType>({
    queryKey: ["schools"],
    queryFn: getSchools,
    refetchInterval: false,
  });

  if (isLoading) {
    return <SpinnerIcon className="mx-auto animate-spin" size={25} />;
  }
  if (!schools) return null;

  if (schools.joined.length === 0 && schools.pending.length === 0) {
    return (
      <section className="mx-auto flex w-full flex-col items-center justify-center gap-8 text-center md:w-96">
        <div>
          <h1 className="text-primary text-2xl font-semibold">
            Simplify your school management
          </h1>
          <p className="text-muted-foreground mt-1">
            To access a school, you need an administrator's invitation, or you
            can start your own school.
          </p>
        </div>
        <button
          onClick={() => setSchoolAction("create")}
          className="text-primary flex w-fit items-center gap-2"
        >
          <Plus className="bg-secondary h-8 w-14 rounded-xl p-2" size={20} />
          Create a new school
        </button>
        <div className="text-muted-foreground mt-10 flex items-center text-sm">
          Not seeing your school?
          <Button
            variant="link"
            onClick={() => {
              deleteCookie("token");
              router.push("/sign-in");
            }}
            className="p-1 font-normal"
          >
            Switch account
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="text-primary text-2xl font-semibold">
          Choose your school on Penwwws
        </h1>
        <p className="text-muted-foreground">
          Select the school that you want to access
        </p>
      </div>

      <div className="bg-primary-600/5 max-h-[50vh] gap-8 overflow-scroll rounded-xl px-6">
        {schools.joined.map(({ school }) => (
          <div
            key={school.id}
            className="flex items-center justify-between py-8 [&:not(:last-child)]:border-b"
          >
            <div className="flex items-center gap-2">
              <Avatar className="bg-primary text-accent rounded-xl">
                <AvatarFallback className="bg-primary">
                  {getInitials(school.name)}
                </AvatarFallback>
                <AvatarImage src={school.logoUrl} />
              </Avatar>
              <div>
                <h1 className="text-primary text-sm font-semibold">
                  {school.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {school.description}
                </p>
              </div>
            </div>

            <Link
              href={`/school/${school.id}/${getRoleRedirectPath(school.members[0].role)}`}
              className="bg-primary text-accent rounded-md px-4 py-1 text-sm font-semibold"
            >
              Select
            </Link>
          </div>
        ))}
      </div>

      <div className="max-h-[50vh] gap-8 overflow-scroll rounded-md bg-amber-800/5 px-6">
        {schools.pending.map(({ school }) => (
          <div
            key={school.id}
            className="flex items-center justify-between py-8 [&:not(:last-child)]:border-b"
          >
            <div className="flex items-center gap-2">
              <Avatar className="text-accent rounded-xl bg-amber-800">
                <AvatarFallback className="bg-amber-800">
                  {getInitials(school.name)}
                </AvatarFallback>
                <AvatarImage src={school.logoUrl} />
              </Avatar>
              <div>
                <h1 className="text-primary text-sm font-semibold">
                  {school.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {school.description}
                </p>
              </div>
            </div>

            <div className="text-accent rounded-full bg-amber-800 px-4 py-1 text-sm font-semibold opacity-90">
              Pending
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setSchoolAction("create")}
        className="text-primary flex w-fit items-center gap-2"
      >
        <Plus className="bg-secondary h-8 w-14 rounded-md p-2" size={20} />
        Create new school
      </button>

      <div className="text-muted-foreground mt-10 flex items-center text-sm">
        Not seeing your school?
        <Button
          variant="link"
          onClick={() => {
            deleteCookie("token");
            router.push("/sign-in");
          }}
          className="p-1 font-normal"
        >
          Switch account
        </Button>
      </div>
    </section>
  );
}
