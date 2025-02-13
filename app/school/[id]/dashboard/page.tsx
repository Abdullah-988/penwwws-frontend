export default async function Page() {
  return (
    <div className="h-full w-full p-4 text-xl">
      <h1>Home</h1>
      <div className="flex w-full justify-center gap-6">
        <div className="h-48 w-1/3 rounded-xl border"></div>
        <div className="h-48 w-1/3 rounded-xl border"></div>
        <div className="h-48 w-1/3 rounded-xl border"></div>
      </div>
    </div>
  );
}
