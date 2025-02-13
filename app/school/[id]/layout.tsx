import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Home, Settings, LibraryBig } from "lucide-react";
import { headers } from "next/headers";
export default async function DashboardLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname") || "Unknown Path";
  const activeSchoolId = (await params).id;
  console.log(pathname);

  const tabs = [
    {
      title: "Home",
      url: "dashboard",
      icon: Home,
    },
    { title: "Settings", url: "dashboard/settings", icon: Settings },
    { title: "Subjects", url: "dashboard/subjects", icon: LibraryBig },
  ];

  return (
    <SidebarProvider>
      <AppSidebar
        activeSchoolId={activeSchoolId}
        tabs={tabs}
        pathname={pathname}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
