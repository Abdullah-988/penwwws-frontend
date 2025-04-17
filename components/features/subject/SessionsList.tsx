import { SessionType } from "@/types/session";
import DeleteSession from "@/components/features/subject/DeleteSession";
import AttendanceDetail from "@/components/features/subject/AttendanceDetail";
import { SchoolUserType } from "@/types/SchoolUser";
import { Badge } from "@/components/ui/badge";
import EditSession from "./EditSession";
import { format } from "date-fns";

type Props = {
  schoolId: string;
  subjectId: number;
  sessions: SessionType[];
  user: SchoolUserType;
};

export default function SessionsList({
  schoolId,
  subjectId,
  sessions,
  user,
}: Props) {
  return (
    <section className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="relative flex flex-col justify-start gap-8 rounded-md border p-4"
        >
          <div className="space-y-2">
            <h1 className="text-md font-bold">{session.name}</h1>
            <span className="text-muted-foreground text-sm">
              Expire date:{" "}
              {format(new Date(session.expirationDate), "MMM dd, yyyy HH:mm")}
            </span>
          </div>
          {user.role === "STUDENT" ? (
            session.attended ? (
              <Badge className="absolute top-4 right-4">Attended</Badge>
            ) : (
              <Badge variant="destructive" className="absolute top-4 right-4">
                Not attended
              </Badge>
            )
          ) : (
            <>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <EditSession
                  schoolId={schoolId}
                  subjectId={subjectId}
                  session={session}
                />
                <DeleteSession
                  schoolId={schoolId}
                  subjectId={subjectId}
                  session={session}
                />
              </div>

              <AttendanceDetail
                schoolId={schoolId}
                subjectId={subjectId}
                session={session}
              />
            </>
          )}
        </div>
      ))}
    </section>
  );
}
