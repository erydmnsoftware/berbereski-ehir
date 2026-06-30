"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

function getPageTitle(path: string): string {
  const titles: Record<string, string> = {
    "/admin": "Genel Bakış",
    "/admin/takvim": "Takvim",
    "/admin/musteriler": "Müşteriler",
    "/admin/ayarlar": "Ayarlar",
  };
  return titles[path] || "Admin Paneli";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const title = getPageTitle(pathname);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === "dark" ? "bg-[#0f1117] text-white" : "bg-[#f4f5f9] text-black"
    }`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-[280px]" : ""}`}>
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
