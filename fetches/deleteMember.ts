import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";

export async function handleDeleteMember(
  schoolId: string,
  memberIds: number[],
) {
  const token = await getCookie("token");
  axios.delete(`/school/${schoolId}/member`, {
    headers: { Authorization: token },
    data: memberIds,
  });
}
