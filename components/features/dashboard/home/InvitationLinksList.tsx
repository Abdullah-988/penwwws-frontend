import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  schoolId: string;
};

async function getSchoolInvitations(schoolId: string) {
  const token = await getCookie("token");
  try {
    const res = await axiosInstance.get(`school/${schoolId}/invitation`, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(
      (error.response && error.response.data) || "Unexpected error occur",
    );
  }
}

type SchoolInvitationType = {
  id: number;
  token: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  createdAt: string;
  updatedAt: string;
};

export default function InvitationLinksList({ schoolId }: Props) {
  const { data: schoolInvitations } = useQuery<SchoolInvitationType[]>({
    queryKey: ["schoolInvitations"],
    queryFn: async () => await getSchoolInvitations(schoolId),
  });

  return (
    <section className="flex w-full flex-col gap-3">
      {schoolInvitations &&
        schoolInvitations.map((invitation) => {
          const generatedLink = `http://localhost:3000/invite/${invitation.token}`;
          return (
            <div key={invitation.id} className="space-y-2">
              <Label htmlFor="link">
                {capitalizeFirstLetter(invitation.role)}
              </Label>
              <div className="flex items-center gap-6">
                <Input
                  id="link"
                  className="text-muted-foreground"
                  defaultValue={generatedLink}
                  readOnly
                />
                <Button
                  onClick={async () =>
                    await navigator.clipboard.writeText(generatedLink)
                  }
                  type="submit"
                  size="sm"
                  className="px-3"
                >
                  <span className="sr-only">Copy</span>
                  <Copy />
                </Button>
              </div>
            </div>
          );
        })}
    </section>
  );
}
