import type {ReactNode} from "react";
import {AdminSidebar} from "@/components/admin/admin-sidebar";

export default function AdminLayout({children}: {children: ReactNode}) {
  return <div className="cms-workspace"><AdminSidebar/><main className="cms-main">{children}</main></div>;
}
