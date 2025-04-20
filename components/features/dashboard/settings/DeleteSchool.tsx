"use client";

import { GraduationCap, LibraryBig, School, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { SchoolType } from "@/types/School";
import { formatNumber } from "@/lib/utils";

type Props = {
  school: SchoolType;
};

export default function DeleteSchool({ school }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmInputValue, setConfirmInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMatch, setIsMatch] = useState<boolean | undefined>(undefined);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const rule = "Delete " + school.name.trim();

  async function handleDeleteSchool(e: FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);
    setIsLoading(true);
    try {
      if (isMatch && school.members[0].role === "SUPER_ADMIN") {
        const token = await getCookie("token");
        await axiosInstance.delete(`/school/${school.id}`, {
          headers: { Authorization: token },
        });
        toast({
          title: "School Deleted",
          description: `The school "${school.name}" has been successfully deleted.`,
        });
        router.push("/console");
        setIsModalOpen(false);
      }
    } catch {
      setErrorMessage("Failed to delete school. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    setIsMatch(confirmInputValue.trim() === rule);

    if (!isMatch && hasSubmitted) {
      setErrorMessage("Does not match");
    } else {
      setErrorMessage("");
    }
  }, [confirmInputValue, rule, errorMessage, isMatch, hasSubmitted]);

  useEffect(() => {
    if (!isModalOpen) {
      setConfirmInputValue("");
      setErrorMessage("");
      setHasSubmitted(false);
    }
  }, [isModalOpen]);

  return (
    <section className="rounded-md">
      <h1 className="text-md mb-3 font-semibold">School Deletion</h1>
      <div className="flex flex-col items-end justify-between gap-3 md:flex-row md:items-center md:gap-12">
        <p className="text-muted-foreground text-sm md:max-w-[35rem]">
          Deleting a school is permanent and cannot be undone. All data,
          including student and staff records, will be removed. Ensure you back
          up important information before proceeding.
        </p>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete school
            </Button>
          </DialogTrigger>

          <DialogContent className="gap-6">
            <DialogHeader>
              <DialogTitle>Delete school</DialogTitle>
            </DialogHeader>
            <div className="flex w-full flex-col items-center gap-4 border-b pb-6">
              <div className="flex items-center gap-3">
                <School size={20} />
                <h1 className="text-xl font-bold">{school.name}</h1>
              </div>
              <div className="flex w-full max-w-sm items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-muted-foreground" />
                  <span>{formatNumber(school._count.students)} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={15} className="text-muted-foreground" />
                  <span>{formatNumber(school._count.teachers)} teachers</span>
                </div>
                <div className="flex items-center gap-2">
                  <LibraryBig size={15} className="text-muted-foreground" />
                  <span>{formatNumber(school._count.subjects)} subjects</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleDeleteSchool} className="space-y-4">
              <DialogDescription className="mb-4">
                Type <strong className="text-destructive">{rule}</strong> to
                confirm. This action is irreversible.
              </DialogDescription>

              {errorMessage && !isMatch && (
                <p className="text-destructive mt-2 text-sm">{errorMessage}</p>
              )}

              <Input
                value={confirmInputValue}
                onChange={(e) => setConfirmInputValue(e.target.value)}
                placeholder={"Enter " + `"${rule}"`}
                disabled={isLoading}
                className="focus-visible:ring-destructive mt-2"
              />

              <DialogFooter className="mt-6 gap-3">
                <Button
                  variant="destructive"
                  disabled={isLoading}
                  type="submit"
                  className="w-full gap-2"
                >
                  {isLoading && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
