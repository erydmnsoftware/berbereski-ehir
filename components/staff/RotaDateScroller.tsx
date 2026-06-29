"use client";

import { DayEntry } from "@/lib/api/types/staff-schedule";
import RotaDayCard from "./RotaDayCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface RotaDateScrollerProps {
  days: DayEntry[];
  onDayClick: (day: DayEntry) => void;
}

export default function RotaDateScroller({ days, onDayClick }: RotaDateScrollerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Scroll Controls (Desktop only) */}
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#444] rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-gray-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scroller Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 px-1"
      >
        {days.map((day) => (
          <RotaDayCard 
            key={day.date} 
            day={day} 
            onClick={() => onDayClick(day)} 
          />
        ))}
      </div>

      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#444] rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-gray-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
