"use client";

import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, LoaderCircle } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";
import DeleteInvitationLink from "@/components/features/dashboard/home/DeleteInvitationLink";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const host = window.location.protocol + "//" + window.location.host;
  const [copiedInvitationId, setCopiedInvitationId] = useState<number | null>(
    null,
  );
  const { data: schoolInvitations, isLoading } = useQuery<
    SchoolInvitationType[]
  >({
    queryKey: ["schoolInvitations"],
    queryFn: async () => await getSchoolInvitations(schoolId),
  });

  if (isLoading)
    <LoaderCircle className="text-muted-foreground h-8 w-8 animate-spin" />;

  return (
    <section className="mt-3 flex max-h-80 w-full flex-col gap-3 overflow-y-scroll p-1">
      {schoolInvitations &&
        schoolInvitations.map((invitation) => {
          const generatedLink = `${host}/invite/${invitation.token}`;
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
                  <TooltipProvider>
                    <Tooltip
                      open={copiedInvitationId === invitation.id}
                      onOpenChange={(open) =>
                        !open && setCopiedInvitationId(null)
                      }
                    >
                      <TooltipTrigger asChild>
                        <Button
                          onClick={async () => {
                            setCopiedInvitationId(invitation.id);
                            await navigator.clipboard.writeText(generatedLink);
                            setTimeout(() => setCopiedInvitationId(null), 500);
                          }}
                          type="submit"
                          size="sm"
                          className="bg-primary/5 text-primary hover:bg-primary/10 px-3"
                        >
                          <span className="sr-only">Copy</span>
                          <Copy />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="">
                        <p>Copied!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          );
        })}
    </section>
  );
}
