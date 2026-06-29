"use client";

import { DayEntry } from "@/lib/api/types/staff-schedule";
import { CalendarDays, Ban } from "lucide-react";

interface RotaDayCardProps {
  day: DayEntry;
  onClick: () => void;
}

export default function RotaDayCard({ day, onClick }: RotaDayCardProps) {
  const isScheduled = day.status === "SCHEDULED" && day.shifts && day.shifts.length > 0;
  
  // Format shift label (e.g., "10:00 - 18:00")
  let shiftLabel = "Kullanım dışı";
  if (isScheduled) {
    if (day.shifts && day.shifts.length > 0) {
      if (day.shifts.length === 1) {
        shiftLabel = `${day.shifts[0].start} - ${day.shifts[0].end}`;
      } else {
        shiftLabel = `${day.shifts[0].start} - ${day.shifts[day.shifts.length - 1].end} (${day.shifts.length} vardiya)`;
      }
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-32 border rounded-md overflow-hidden flex flex-col hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring ${
        isScheduled ? "border-[#1f9328]" : "border-gray-300 dark:border-gray-600"
      }`}
    >
      {/* Top Header - Green if active, light if off */}
      <div 
        className={`px-2 py-2 text-center text-sm font-semibold border-b ${
          isScheduled 
            ? "bg-[#1f9328] text-white border-[#1f9328]" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
        }`}
      >
        {day.dayLabel}
      </div>

      {/* Bottom Content */}
      <div className="bg-white dark:bg-[#1a1a1a] flex-1 py-4 flex items-center justify-center">
        {isScheduled ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
            <CalendarDays className="w-3.5 h-3.5 text-[#111]" />
            <span>{shiftLabel}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <Ban className="w-3.5 h-3.5" />
            <span>Kullanım dışı</span>
          </div>
        )}
      </div>
    </button>
  );
}
