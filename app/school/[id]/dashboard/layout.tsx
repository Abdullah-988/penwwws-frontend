import { AppSidebar } from "@/components/features/dashboard/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSchool } from "@/fetches/school";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const activeSchoolId = (await params).id;

  const school = await getSchool(activeSchoolId);

  const role = school.members[0].role.toLowerCase();

  if (role != "admin" && role != "super_admin") {
    redirect(`/school/${activeSchoolId}/home`);
  }

  return (
    <SidebarProvider>
      <AppSidebar activeSchoolId={activeSchoolId} />
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
