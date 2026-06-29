"use client";

import { useState } from "react";
import { GroupByMode } from "@/lib/api/types/staff-schedule";
import { useStaffScheduleReport } from "@/lib/api/staff-schedule";
import ScheduleReportControls from "@/components/staff-schedule-report/ScheduleReportControls";
import ScheduleReportTable from "@/components/staff-schedule-report/ScheduleReportTable";
import { Info } from "lucide-react";

export default function SingleStaffScheduleReportPage({ params }: { params: { staffId: string } }) {
  const [year, setYear] = useState(2026);
  const [groupBy, setGroupBy] = useState<GroupByMode>("MONTH");
  const [startParam, setStartParam] = useState("1"); // or "MON"

  const { data, isLoading } = useStaffScheduleReport(params.staffId, year, groupBy);

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
          Çalışma Saatleri Raporu
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Personelin geçmiş ve gelecek vardiya planlamalarını yönetin.</p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-[#1a1a1a] border-l-4 border-gray-400 dark:border-gray-600 rounded-r-xl">
        <Info className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Tarih satırlarına tıklayarak o güne ait vardiyayı <span className="font-semibold text-gray-900 dark:text-white">düzenleyebilir veya tüm günü bloke edebilirsiniz</span>.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-3xl overflow-hidden shadow-sm">
        <ScheduleReportControls 
          year={year} setYear={setYear}
          groupBy={groupBy} setGroupBy={setGroupBy}
          startParam={startParam} setStartParam={setStartParam}
        />
        
        <div className="p-4 bg-gray-50/30 dark:bg-[#151515]">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center text-gray-400 animate-pulse">
              Veriler yükleniyor...
            </div>
          ) : data ? (
            <ScheduleReportTable groupBy={groupBy} data={data} isMulti={false} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
