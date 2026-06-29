"use client";

import { MultiStaffScheduleReport } from "@/lib/api/types/staff-schedule";
import { Clock } from "lucide-react";

interface StaffComparisonSummaryCardsProps {
  data: MultiStaffScheduleReport;
}

export default function StaffComparisonSummaryCards({ data }: StaffComparisonSummaryCardsProps) {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.staffReports.map(report => {
        // Calculate total scheduled hours across all periods in this report (e.g. this year)
        const totalScheduled = report.periods.reduce((sum, p) => sum + p.scheduledHours, 0);
        const totalWorked = report.periods.reduce((sum, p) => sum + p.workedHours, 0);
        const totalBooked = report.periods.reduce((sum, p) => sum + p.bookedHours, 0);

        return (
          <div key={report.staffId} className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-[#222] p-5 rounded-2xl shadow-sm flex flex-col gap-3 animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{report.staffName}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Vardiya Süresi</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  {totalScheduled} <span className="text-sm font-medium text-gray-400">st</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Doluluk</p>
                <p className="text-xl font-bold text-[#B5482E] flex items-center gap-1.5">
                  {totalBooked} <span className="text-sm font-medium text-[#B5482E]/70">st</span>
                </p>
              </div>
            </div>
            
            <div className="h-1.5 w-full bg-gray-100 dark:bg-[#222] rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-[#B5482E] rounded-full" 
                style={{ width: `${Math.min(100, totalScheduled > 0 ? (totalBooked / totalScheduled) * 100 : 0)}%` }} 
              />
            </div>
            <p className="text-xs text-gray-500 text-right">
              {totalScheduled > 0 ? Math.round((totalBooked / totalScheduled) * 100) : 0}% Doluluk Oranı
            </p>
          </div>
        );
      })}
    </div>
  );
}
