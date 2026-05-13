"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
  userEmail: string;
  userName: string;
};

export function AdminShell({
  children,
  userEmail,
  userName,
}: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div
        className={`${isSidebarOpen ? "w-[280px]" : "w-0"} h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out`}
      >
        <div className="h-full w-[280px]">
          <AdminSidebar
            userEmail={userEmail}
            userName={userName}
            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
