"use client";

import { getCookie } from "cookies-next";
import { GroupType } from "@/types/Group";
import axios from "@/lib/axiosInstance";
import { formatGroups } from "@/lib/utils";

export async function getGroups(schoolId: string) {
  const token = await getCookie("token");
  const res = await axios.get<GroupType[]>(`/school/${schoolId}/group`, {
    headers: { Authorization: token },
  });
  return formatGroups(res.data);
}
