"use client";

import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserType } from "@/types/User";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useRouter } from "next/navigation";

async function getMembershipRequests(schoolId: string) {
  const token = await getCookie("token");
  try {
    const res = await axios.get(`school/${schoolId}/admission`, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(
      (error.response && error.response.data) || "Unexpected error occurred",
    );
    throw error;
  }
}

type RequestType = {
  id: number;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  schoolId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  token: string;
  user: UserType;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  schoolId: string;
};

export const MembershipRequest = ({ schoolId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(
    null,
  );
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);

  const { data: requests } = useQuery<RequestType[]>({
    queryKey: ["requests"],
    queryFn: async () => getMembershipRequests(schoolId),
  });

  const mutation = useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: number;
      status: "accept" | "reject";
    }) => {
      const token = await getCookie("token");
      await axios.post(
        `school/${schoolId}/admission/${requestId}/review`,
        { status },
        { headers: { Authorization: token } },
      );
    },
    onMutate: (variables) => {
      setProcessingRequestId(variables.requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setEditingRequestId(null);
      router.refresh();
    },
    onError: (error: AxiosError) => {
      console.error(
        (error.response && error.response.data) || "Failed to process request",
      );
      toast({
        title: "Error",
        description:
          (error.response && (error.response.data as string)) ||
          "Failed to process request",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setProcessingRequestId(null);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Membership Requests (
          {requests?.filter((request) => request.status === "PENDING").length ||
            0}
          )
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[50rem]">
        <DialogHeader>
          <DialogTitle>Membership Requests</DialogTitle>
          <DialogDescription>
            Manage membership requests for your school
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[80vh] space-y-4 overflow-y-scroll">
          {requests?.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No membership requests
            </div>
          ) : (
            requests?.map((request) => (
              <div
                key={request.id}
                className="relative flex items-center justify-between rounded-lg border p-4"
              >
                <div
                  className={clsx("space-y-1", {
                    "opacity-50":
                      request.status !== "PENDING" &&
                      editingRequestId !== request.id,
                  })}
                >
                  <div className="font-medium">{request.user.fullName}</div>
                  <div className="text-muted-foreground text-sm">
                    {request.user.email}
                  </div>
                  <div className="text-sm">
                    Requested role: {request.role.toLowerCase()}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(request.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <Badge
                  className={clsx(
                    "absolute top-2 right-2 rounded-tr-md text-xs",
                    request.status === "ACCEPTED" &&
                      "bg-primary/10 text-primary",
                    request.status === "REJECTED" &&
                      "text-destructive bg-destructive/10",
                    request.status === "PENDING" &&
                      "bg-amber-800/10 text-amber-800",
                    request.status !== "PENDING" &&
                      editingRequestId !== request.id &&
                      "opacity-50",
                  )}
                >
                  {capitalizeFirstLetter(request.status)}
                </Badge>
                <div className="flex flex-col items-end gap-2">
                  {(request.status === "PENDING" ||
                    editingRequestId === request.id) && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          mutation.mutate({
                            requestId: request.id,
                            status: "reject",
                          })
                        }
                        disabled={processingRequestId === request.id}
                        size="sm"
                        className="h-8"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() =>
                          mutation.mutate({
                            requestId: request.id,
                            status: "accept",
                          })
                        }
                        disabled={processingRequestId === request.id}
                        size="sm"
                        className="h-8 px-3"
                      >
                        Accept
                      </Button>
                    </div>
                  )}

                  {request.status === "REJECTED" &&
                    editingRequestId !== request.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setEditingRequestId(request.id)}
                      >
                        Change decision
                      </Button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
