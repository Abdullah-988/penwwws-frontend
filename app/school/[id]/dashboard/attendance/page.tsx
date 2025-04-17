import CreateAttendanceCredential from "@/components/features/dashboard/attendance/createAttendanceCredential";
import DeleteCredential from "@/components/features/dashboard/attendance/DeleteCredential";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";

async function getCredentials(schoolId: string) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(`/school/${schoolId}/device`, {
    headers: { Authorization: token },
  });
  return res.data;
}

export type CredentialType = {
  id: number;
  credentialId: string;
  createdAt: string;
  updatedAt: string;
};

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  const credentials: CredentialType[] = await getCredentials(schoolId);

  return (
    <div className="relative flex w-full flex-col gap-8 p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Attendance</h1>
        <CreateAttendanceCredential schoolId={schoolId} />
      </div>

      <div className="grid w-full grid-cols-1 items-start gap-4 md:grid-cols-3 lg:grid-cols-4">
        {credentials.map((credential) => (
          <div
            key={credential.id}
            className="flex items-center justify-between gap-4 rounded-md border p-4"
          >
            <div>
              <h1 className="mb-2 text-sm font-semibold">
                <span className="text-muted-foreground font-normal">
                  Credential ID:{" "}
                </span>
                {credential.credentialId}
              </h1>
              <span className="text-muted-foreground mt-2 text-xs">
                Created at: {new Date(credential.createdAt).toLocaleString()}
              </span>
            </div>
            <DeleteCredential schoolId={schoolId} credential={credential} />
          </div>
        ))}
      </div>
    </div>
  );
}
