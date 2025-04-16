import { SessionType } from "@/types/session";
import DeleteSession from "./DeleteSession";

type Props = {
  schoolId: string;
  subjectId: number;
  sessions: SessionType[];
};

export default function SessionsList({ schoolId, subjectId, sessions }: Props) {
  console.log(schoolId, subjectId);
  return (
    <section className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="relative flex justify-start gap-4 rounded-md border p-4"
        >
          <h1 className="text-lg font-bold">{session.name}</h1>
          <DeleteSession
            schoolId={schoolId}
            subjectId={subjectId}
            session={session}
          />
        </div>
      ))}
    </section>
  );
}
