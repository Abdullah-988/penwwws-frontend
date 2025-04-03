import { badgeColor } from "@/components/shared/columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { capitalizeFirstLetter, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import React from "react";
import { MemberType } from "@/types/member";

type Props = {
  members: Omit<MemberType, "groups">[];
};

export default function ClassmatesTable({ members }: Props) {
  return (
    <Table className="mt-4 rounded-2xl border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] rounded-2xl">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => (
          <TableRow key={member.id || index}>
            <TableCell>{member.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="size-8 rounded-full">
                  <AvatarFallback>
                    {getInitials(member.fullName ?? "")}
                  </AvatarFallback>
                  <AvatarImage src={member.avatarUrl} />
                </Avatar>

                {member.fullName}
              </div>
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>
              {
                <Badge
                  className={clsx("rounded-full", badgeColor[member.role])}
                >
                  {capitalizeFirstLetter(member.role)}
                </Badge>
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
