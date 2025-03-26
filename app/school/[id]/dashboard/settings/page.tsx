import DeleteSchool from "@/components/features/dashboard/settings/DeleteSchool";
import axios from "@/lib/axiosInstance";
import { SchoolType } from "@/types/School";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

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
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mx-auto my-12 w-full md:max-w-[50rem]">
        <section className="rounded-xl border">
          <div className="border-b py-2">
            <h1 className="px-3 text-lg font-semibold">School Deletion</h1>
          </div>
          <div className="flex flex-col items-end justify-between gap-3 px-3 py-6 md:flex-row md:items-center md:gap-12">
            <p className="text-muted-foreground md:max-w-[35rem]">
              Deleting a school is permanent and cannot be undone. All data,
              including student and staff records, will be removed. Ensure you
              back up important information before proceeding.
            </p>
            <DeleteSchool school={school} />
          </div>
        </section>
      </div>
    </div>
  );
}
