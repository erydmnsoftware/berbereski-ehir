"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  FileText,
  Users,
  Clock,
  Mail,
  Bell,
  UserCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Scissors,
  Sun,
  Moon,
  X,
  Menu,
  Settings,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: any[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Takvim", icon: CalendarDays, path: "/admin/takvim" },
  { label: "Müşteriler", icon: Users, path: "/admin/musteriler" },
  { label: "Hizmetler", icon: Scissors, path: "/admin/hizmetler" },
  { label: "Stok/Envanter", icon: Package, path: "/admin/inventory" },
  { 
    label: "İş Geliştirme", 
    icon: TrendingUp, 
    children: [
      { label: "Çalışan Vardiyası", path: "/admin/staff/rota" },
      { label: "Raporlar", path: "/admin/reports" },
    ]
  },
  { label: "Ayarlar", icon: Settings, path: "/admin/ayarlar" }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [expandedItem, setExpandedItem] = useState<string | null>("Dashboard");

  const isActive = (path: string) => pathname === path;

  const handleNavigate = (path: string) => {
    router.push(path);
    if (window.innerWidth < 1024) onClose();
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 h-full z-50 w-[280px] flex flex-col border-r transition-colors duration-200 bg-[#111111] border-[#333333]`}
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <img loading="lazy" decoding="async" src="/logo.png" alt="BerberOS Logo" className="h-10 object-contain" />
            <span className="text-xl font-bold text-white tracking-wide">
              BerberOS
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (item.children) {
                    setExpandedItem(expandedItem === item.label ? null : item.label);
                  } else {
                    handleNavigate(item.path);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${item.children && item.children.some((c: any) => isActive(c.path))
                    ? "bg-[#d4a853]/20 text-[#d4a853]"
                    : isActive(item.path)
                      ? "bg-[#d4a853]/20 text-[#d4a853]"
                      : "text-[#a0a0a0] hover:bg-[#222222] hover:text-white"
                  }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.children && (
                  expandedItem === item.label ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )
                )}
              </button>

              {/* Submenu */}
              <AnimatePresence>
                {item.children && expandedItem === item.label && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-4"
                  >
                    {item.children.map((child: any) => (
                      <button
                        key={child.path}
                        onClick={() => handleNavigate(child.path)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5 ${isActive(child.path)
                            ? theme === "dark"
                              ? "text-[#a78bfa] bg-[#7f56d9]/10"
                              : "text-[#7f56d9] bg-[#f9f5ff]"
                            : theme === "dark"
                              ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                              : "text-[#475467] hover:text-[#344054] hover:bg-gray-50"
                          }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 border-t border-[#333333]">
          {/* Theme Toggle */}
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-2 transition-all duration-150 text-[#a0a0a0] hover:bg-[#222222] hover:text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Siteye Dön</span>
          </Link>

          {/* Logout */}
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-[#a0a0a0] hover:bg-[#222222] hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
