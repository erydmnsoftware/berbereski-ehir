"use client";

import { Search, Bell, Settings, Menu } from "lucide-react";
import { useTheme } from "next-themes";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export default function TopBar({ title, onMenuClick }: TopBarProps) {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b transition-colors duration-200 bg-[#111111] border-[#333333]">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-colors hover:bg-[#222] text-[#888]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-white tracking-wide">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors bg-[#161616] border-[#333] text-[#aaa]">
          <Search className="w-4 h-4 text-[#888]" />
          <input
            type="text"
            placeholder="Arama..."
            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-[#666] text-white"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-lg transition-colors hover:bg-[#222] text-[#888]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#d4a853] rounded-full shadow-[0_0_10px_rgba(212,168,83,0.5)]" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg transition-colors hover:bg-[#222] text-[#888]">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#d4a853] flex items-center justify-center text-black text-sm font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
