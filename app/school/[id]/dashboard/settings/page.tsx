import DeleteSchool from "@/components/features/dashboard/settings/DeleteSchool";
import EditSchool from "@/components/features/dashboard/settings/EditSchool";
import axios from "@/lib/axiosInstance";
import { SchoolType } from "@/types/School";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { School, Settings } from "lucide-react";
import Image from "next/image";

async function getSchool(schoolId: string) {
  try {
    const token = await getCookie("token", { cookies });
    const res = await axios.get(`/school/${schoolId}`, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(
      (error.response && (error.response.data as string)) ||
        "Unexpected error occur",
    );
  }
}
export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  const school: SchoolType = await getSchool(schoolId);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
        <Settings size={30} />
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto my-12 flex w-full flex-col gap-12 md:max-w-[40rem]">
        <section className="flex items-center justify-start gap-6">
          {school.logoUrl ? (
            <Image
              src={school.logoUrl}
              width={50}
              height={50}
              alt={`${school.name} Logo`}
            />
          ) : (
            <School className="text-primary size-10" />
          )}
          <div>
            <h1 className="flex justify-between font-semibold">
              {school.name}
            </h1>
            <p className="text-muted-foreground line-clamp-4 max-w-[20rem] text-sm">
              {school.description}
            </p>
          </div>
        </section>
        <EditSchool school={school} />
        <DeleteSchool school={school} />
      </div>
    </div>
  );
}
