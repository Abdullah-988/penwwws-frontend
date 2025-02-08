"use client";

import { Dispatch, SetStateAction } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { LoaderCircle as SpinnerIcon, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type SchoolType = {
  school: {
    id: number;
    name: string;
    logoUrl?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
};

async function getSchools() {
  try {
    const token = await getCookie("token");
    const res = await axios.get("/school", {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(error.response?.data || "Unexpected error occurred");
  }
}

type Props = {
  setCarouselIndex: Dispatch<SetStateAction<0 | 1>>;
};
export default function ChooseSchool({ setCarouselIndex }: Props) {
  const router = useRouter();
  const { data: schoolsList, isLoading } = useQuery<SchoolType[]>({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  if (isLoading) {
    return <SpinnerIcon className="mx-auto animate-spin" size={25} />;
  }

  if (!schoolsList || schoolsList.length === 0) {
    return (
      <section className="mx-auto flex w-96 flex-col gap-8 text-center">
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
          onClick={() => setCarouselIndex(1)}
          className="text-primary mx-auto flex w-fit items-center gap-2"
        >
          <Plus className="bg-secondary h-8 w-14 rounded-xl p-2" size={20} />
          Create a new school
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="text-primary text-2xl font-semibold">
          Join your school on Penwwws
        </h1>
        <p className="text-muted-foreground">
          Choose the school that you want to join
        </p>
      </div>

      <div className="bg-primary-600/5 max-h-[50vh] gap-8 overflow-scroll rounded-xl px-6">
        {schoolsList.map(({ school }) => (
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
              href={`/school/${school.id}`}
              className="bg-primary text-accent rounded-full px-4 py-1 text-sm font-semibold"
            >
              Join
            </Link>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCarouselIndex(1)}
        className="text-primary flex w-fit items-center gap-2"
      >
        <Plus className="bg-secondary h-8 w-14 rounded-xl p-2" size={20} />
        Create new school
      </button>

      <div className="text-muted-foreground mt-10 flex items-center gap-1 text-sm">
        Not seeing your school
        <button
          onClick={() => {
            deleteCookie("token");
            router.push("sign-in");
          }}
          className="hover:text-primary hover:underline"
        >
          Switch account
        </button>
      </div>
    </section>
  );
}
