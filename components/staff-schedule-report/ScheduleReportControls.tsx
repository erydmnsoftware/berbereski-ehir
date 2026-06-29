"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GroupByMode } from "@/lib/api/types/staff-schedule";
import { Calendar, Layers } from "lucide-react";
import { useEffect, useState } from "react";

interface ScheduleReportControlsProps {
  year: number;
  setYear: (val: number) => void;
  groupBy: GroupByMode;
  setGroupBy: (val: GroupByMode) => void;
  startParam: string; // value for the third dropdown
  setStartParam: (val: string) => void;
}

export default function ScheduleReportControls({
  year,
  setYear,
  groupBy,
  setGroupBy,
  startParam,
  setStartParam
}: ScheduleReportControlsProps) {
  
  // Reset start param when group by changes
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 200);
    return () => clearTimeout(timeout);
  }, [groupBy]);

  const handleGroupByChange = (val: GroupByMode) => {
    setGroupBy(val);
    setStartParam(val === "MONTH" ? "1" : "MON");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-[#151515] border-b border-gray-100 dark:border-[#222]">
      
      {/* Year */}
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-1 border border-gray-200 dark:border-[#333]">
        <Calendar className="w-4 h-4 text-gray-500 ml-2" />
        <Select value={year.toString()} onValueChange={(val) => setYear(Number(val))}>
          <SelectTrigger className="w-[100px] border-0 bg-transparent focus:ring-0 shadow-none font-semibold text-gray-700 dark:text-gray-200">
            <SelectValue placeholder="Yıl" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2027">2027</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Group By */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-lg px-3">
        <Layers className="w-4 h-4 text-gray-500" />
        <Select value={groupBy} onValueChange={handleGroupByChange}>
          <SelectTrigger className="w-[140px] border-0 bg-transparent focus:ring-0 shadow-none font-medium px-0">
            <SelectValue placeholder="Grupla" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MONTH">Aya Göre Grupla</SelectItem>
            <SelectItem value="WEEK">Haftaya Göre Grupla</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional 3rd Dropdown */}
      <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {groupBy === "MONTH" ? (
          <Select value={startParam} onValueChange={setStartParam}>
            <SelectTrigger className="w-[160px] bg-white dark:bg-[#111] border-gray-200 dark:border-[#333] font-medium text-gray-600 dark:text-gray-300">
              <SelectValue placeholder="Ay başlangıcı" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Ayın 1'i ile başlayın</SelectItem>
              <SelectItem value="15">Ayın 15'i ile başlayın</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select value={startParam} onValueChange={setStartParam}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-[#111] border-gray-200 dark:border-[#333] font-medium text-gray-600 dark:text-gray-300">
              <SelectValue placeholder="Hafta başlangıcı" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MON">Pazartesi ile başlayın</SelectItem>
              <SelectItem value="TUE">Salı ile başlayın</SelectItem>
              <SelectItem value="WED">Çarşamba ile başlayın</SelectItem>
              <SelectItem value="THU">Perşembe ile başlayın</SelectItem>
              <SelectItem value="FRI">Cuma ile başlayın</SelectItem>
              <SelectItem value="SAT">Cumartesi ile başlayın</SelectItem>
              <SelectItem value="SUN">Pazar ile başlayın</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

    </div>
  );
}
