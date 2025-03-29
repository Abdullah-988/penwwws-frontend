"use client";

import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";
import DeleteInvitationLink from "@/components/features/dashboard/home/DeleteInvitationLink";

type Props = {
  schoolId: string;
};

async function getSchoolInvitations(schoolId: string) {
  const token = await getCookie("token");
  try {
    const res = await axios.get(`school/${schoolId}/invitation`, {
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
    <section className="mt-3 flex max-h-80 w-full flex-col gap-3 overflow-y-scroll p-1">
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
                <div className="flex items-center gap-2">
                  <DeleteInvitationLink
                    schoolId={schoolId}
                    tokenId={invitation.id}
                  />
                  <Button
                    onClick={async () =>
                      await navigator.clipboard.writeText(generatedLink)
                    }
                    type="submit"
                    size="sm"
                    className="bg-primary/5 text-primary hover:bg-primary/10 px-3"
                  >
                    <span className="sr-only">Copy</span>
                    <Copy />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
    </section>
  );
}
