"use client";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <MobileNav />
      <main className="app-main">{children}</main>
    </div>
  );
}
