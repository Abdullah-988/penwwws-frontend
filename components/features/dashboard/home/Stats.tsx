import { Users, GraduationCap, BookText } from "lucide-react";
import { getSchool } from "@/fetches/school";

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
      icon: BookText,
    },
  ];
  return (
    <section className="flex w-full flex-wrap justify-center gap-4 lg:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex grow flex-col items-start justify-between gap-8 rounded-xl border p-4"
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <stat.icon className="text-primary-700 size-6" />
            <h1 className="font-bold">{stat.title}</h1>
          </div>

          <h1 className="text-4xl font-bold">
            {new Intl.NumberFormat("en-US").format(stat.count)}
          </h1>
        </div>
      ))}
    </section>
  );
}
