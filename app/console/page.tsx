import { ConsoleAside } from "@/components/features/console/ConsoleAside";
import PenwwwsIcon from "@/components/icons/PenwwwsIcon";

export default function ConsolePage() {
  return (
    <div className="flex h-screen w-full">
      <ConsoleAside />
      <aside className="bg-primary relative hidden h-full w-1/2 flex-col items-start justify-between overflow-hidden p-10 lg:flex">
        <div className="text-primary-foreground flex items-center gap-1 self-start py-2 text-lg font-semibold">
          <PenwwwsIcon className="h-5 w-5" />
          <span>Penwwws</span>
        </div>
        <PenwwwsIcon className="text-primary-50/5 absolute -top-40 -right-60 h-[45rem] w-[45rem]" />
        <div className="flex flex-col gap-4">
          <p className="text-primary-50/50 text-sm">
            'The greatest enemy of knowledge is not ignorance, but the illusion
            of knowledge. True wisdom lies in questioning even what we claim to
            know. It is through this relentless pursuit of understanding that we
            can truly expand our horizons.'
          </p>
          <h1 className="text-accent text-sm font-semibold">Stephen Hawking</h1>
        </div>
      </aside>
    </div>
  );
}
