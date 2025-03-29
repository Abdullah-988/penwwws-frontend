import { Users, GraduationCap, LibraryBig } from "lucide-react";
import { getSchool } from "@/fetches/school";
import { formatNumber } from "@/lib/utils";

type Props = {
  schoolId: string;
};
export default async function Stats({ schoolId }: Props) {
  const school = await getSchool(schoolId);

  const stats = [
    { title: "Total students", count: school._count.students, icon: Users },
    {
      title: "Total Teachers",
      count: school._count.teachers,
      icon: GraduationCap,
    },
    {
      title: "Total Subjects",
      count: school._count.subjects,
      icon: LibraryBig,
    },
  ];
  return (
    <section className="flex w-full flex-wrap justify-center gap-2">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex grow flex-row items-start justify-between rounded-lg border p-4"
        >
          <div>
            <div className="flex items-center text-sm font-semibold text-neutral-500">
              <h1 className="font-semibold">{stat.title}</h1>
            </div>

            <h1 className="mt-2 text-4xl font-bold">
              {formatNumber(stat.count)}
            </h1>
          </div>
          <div className="rounded-lg border p-2">
            <stat.icon className="text-primary-700 size-6" />
          </div>
        </div>
      ))}
    </section>
  );
}
