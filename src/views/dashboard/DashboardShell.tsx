"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type DashboardShellProps = {
  children: React.ReactNode;
  userEmail: string;
  userName: string;
};

export function DashboardShell({
  children,
  userEmail,
  userName,
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div
        className={`${isSidebarOpen ? "w-[280px]" : "w-0"} shrink-0 overflow-hidden transition-[width] duration-300 ease-out`}
      >
        <div className="w-[280px]">
          <Sidebar userEmail={userEmail} userName={userName} />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={userName}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
