"use client";

import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, getRoleRedirectPath } from "@/lib/utils";
import { LogOut, Settings } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookie } from "cookies-next";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { RoleType } from "@/types/Role";
import { SchoolUserType } from "@/types/SchoolUser";

export type SchoolType = {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: { role: RoleType }[];
};

export async function getSchool(schoolId: string) {
  try {
    const token = await getCookie("token");
    const res = await axios.get(`/school/${schoolId}`, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(error.response?.data || "Unexpected error occurred");
  }
}

type Props = {
  schoolId: string;
  user: SchoolUserType;
};

export default function Navbar({ schoolId, user }: Props) {
  const router = useRouter();

  const { data: school, isLoading: isSchoolLoading } = useQuery<SchoolType>({
    queryKey: ["school", schoolId],
    queryFn: () => getSchool(schoolId),
  });

  return (
    <nav className="flex items-center justify-between border-b p-6">
      <Link
        href={`/school/${schoolId}/${getRoleRedirectPath(user.role)}`}
        className="text-md flex items-center gap-3 font-semibold"
      >
        {isSchoolLoading ? (
          <Skeleton className="size-12 rounded-full" />
        ) : (
          <>
            <Avatar className="size-12">
              <AvatarImage src={school?.logoUrl} />
              <AvatarFallback>{getInitials(school?.name ?? "")}</AvatarFallback>
            </Avatar>
            <h1 className="hover:underline">{school?.name}</h1>
          </>
        )}
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            {!user ? (
              <Skeleton className="size-12 rounded-full" />
            ) : (
              <Avatar className="size-12 rounded-full">
                <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.fullName ?? "")}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              {!user ? (
                <Skeleton className="size-8 rounded-lg" />
              ) : (
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.fullName ?? "")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                {!user ? (
                  <>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="mt-1 h-3 w-32" />
                  </>
                ) : (
                  <>
                    <span className="truncate font-semibold">
                      {user?.fullName}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Profile settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              deleteCookie("token");
              router.push("/sign-in");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
