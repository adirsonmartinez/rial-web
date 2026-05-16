"use client";

import { useState } from "react";
import type { SubscriptionInfo } from "@/lib/subscription";
import { Topbar } from "@/views/shared/Topbar";
import { Sidebar } from "./Sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
  userEmail: string;
  userName: string;
  subscription: SubscriptionInfo;
};

export function DashboardShell({
  children,
  userEmail,
  userName,
  subscription,
}: DashboardShellProps) {
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
          <Sidebar
            userEmail={userEmail}
            userName={userName}
            subscription={subscription}
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Topbar
          userName={userName}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
