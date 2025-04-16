import { SessionType } from "@/types/session";

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
        <div key={session.id}>hello</div>
      ))}
    </section>
  );
}
