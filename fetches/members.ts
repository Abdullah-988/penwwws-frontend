import axios from "@/lib/axiosInstance";
import { UserType } from "@/types/User";
import { getCookie } from "cookies-next";

type filterRoleType = "ALL" | "ADMIN" | "TEACHER" | "STUDENT";

export default async function GetMembers(
  schoolId: string,
  filterBy: { role?: filterRoleType },
) {
  let filteredMembers: UserType[] = [];

  try {
    const token = await getCookie("token");
    const res = await axios.get(`/school/${schoolId}/member`, {
      headers: { Authorization: token },
    });

    if (filterBy.role && filterBy.role !== "ALL") {
      filteredMembers = res.data.filter(
        (member: UserType) => member.role === filterBy.role,
      );
    } else {
      return res.data;
    }

    return filteredMembers;
  } catch (err) {
    console.error(err);
  }
}
