import axios from "@/lib/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

type Props = {
  schoolId: string;
  subjectId: number;
};

type ActionType =
  | "MARK_CHANGE"
  | "MARK_TABLE_ADD"
  | "MARK_TABLE_EDIT"
  | "MARK_TABLE_DELETE"
  | "DOCUMENT_ADD"
  | "DOCUMENT_EDIT"
  | "DOCUMENT_DELETE"
  | "ASSIGNMENT_ADD"
  | "ASSIGNMENT_EDIT"
  | "ASSIGNMENT_DELETE"
  | "ATTENDANCE_SESSION_ADD"
  | "ATTENDANCE_SESSION_EDIT"
  | "ATTENDANCE_SESSION_DELETE"
  | "ATTENDANCE_DELETE";

type UserType = {
  fullName: string;
  id: number;
  email: string;
  avatarUrl: string;
};

type LogType = {
  id: number;
  details: string;
  action: ActionType;
  subjectId: number;
  author: UserType;
  user: UserType;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

async function getLogs(
  schoolId: string,
  subjectId: number,
): Promise<LogType[]> {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(`/school/${schoolId}/subject/${subjectId}/log`, {
    headers: { Authorization: token },
  });
  return res.data;
}

function getActionLabel(action: ActionType): string {
  const actions = {
    MARK_CHANGE: "Grade Change",
    MARK_TABLE_ADD: "Added Grade Table",
    MARK_TABLE_EDIT: "Edited Grade Table",
    MARK_TABLE_DELETE: "Deleted Grade Table",
    DOCUMENT_ADD: "Added Document",
    DOCUMENT_EDIT: "Edited Document",
    DOCUMENT_DELETE: "Deleted Document",
    ASSIGNMENT_ADD: "Added Assignment",
    ASSIGNMENT_EDIT: "Edited Assignment",
    ASSIGNMENT_DELETE: "Deleted Assignment",
    ATTENDANCE_SESSION_ADD: "Added Attendance Session",
    ATTENDANCE_SESSION_EDIT: "Edited Attendance Session",
    ATTENDANCE_SESSION_DELETE: "Deleted Attendance Session",
    ATTENDANCE_DELETE: "Deleted Attendance",
  };
  return actions[action] || action;
}

function getActionColor(action: ActionType): string {
  const colors = {
    MARK_CHANGE:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    MARK_TABLE_ADD:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    MARK_TABLE_EDIT:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    MARK_TABLE_DELETE:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    DOCUMENT_ADD:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    DOCUMENT_EDIT:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    DOCUMENT_DELETE:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    ASSIGNMENT_ADD:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ASSIGNMENT_EDIT:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    ASSIGNMENT_DELETE:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    ATTENDANCE_SESSION_ADD:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ATTENDANCE_SESSION_EDIT:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    ATTENDANCE_SESSION_DELETE:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    ATTENDANCE_DELETE:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return (
    colors[action] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  );
}

export default async function LogsTabContent({ schoolId, subjectId }: Props) {
  const logs = await getLogs(schoolId, subjectId);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>

      <div className="space-y-4">
        {logs?.map((log) => (
          <div
            key={log.id}
            className="bg-card flex items-start gap-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={log.author.avatarUrl}
                alt={log.author.fullName}
              />
              <AvatarFallback className="text-sm font-medium">
                {log.author.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getActionColor(log.action)}>
                  {getActionLabel(log.action)}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(log.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-foreground text-sm">
                {log.details}{" "}
                {(log.action === "MARK_CHANGE" ||
                  log.action == "ATTENDANCE_DELETE") && (
                  <>for {log.user.fullName}</>
                )}
              </p>{" "}
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <span>By:</span>
                <span className="font-medium">{log.author.fullName}</span>
                <span>•</span>
                <span>{log.author.email}</span>
              </div>
            </div>
          </div>
        ))}

        {!logs?.length && (
          <div className="bg-card flex h-32 items-center justify-center rounded-lg border">
            <p className="text-muted-foreground">No activity found</p>
          </div>
        )}
      </div>
    </section>
  );
}
