import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/getAdminSession";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
export const runtime="nodejs"; export const dynamic="force-dynamic";
export default async function AdminLayout({children}:{children:React.ReactNode}){const session=await getAdminSession();if(!session)redirect("/login");return <div className="min-h-screen flex flex-col md:flex-row bg-ink-950"><AdminSidebar/><div className="flex-1 flex flex-col min-w-0"><AdminTopbar email={session.email} picture={session.picture}/><main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main></div></div>;}
