export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  console.log(await params.id);
  return <div>page</div>;
}
