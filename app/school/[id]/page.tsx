import NotFound from "@/app/not-found";
import axios from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function School({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const schoolId = (await params).id;

  const res = await axios
    .get(`/me/${schoolId}`, {
      headers: {
        Authorization: token?.value,
      },
    })
    .catch(() => {
      return { status: 404, data: { role: "" } };
    });

  if (res.status !== 200) {
    return <NotFound />;
  }

  if (
    res.data.role.toLowerCase() == "admin" ||
    res.data.role.toLowerCase() == "super_admin"
  ) {
    redirect(`/school/${schoolId}/dashboard`);
  } else {
    redirect(`/school/${schoolId}/home`);
  }
}
