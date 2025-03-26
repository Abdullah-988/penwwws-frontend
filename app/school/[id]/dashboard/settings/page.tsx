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
    <div>
      SettingsPage
      <DeleteSchool school={school} />
    </div>
  );
}
