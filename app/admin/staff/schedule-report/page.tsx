"use client";

import { useState } from "react";
import { GroupByMode } from "@/lib/api/types/staff-schedule";
import { useMultiStaffScheduleReport } from "@/lib/api/staff-schedule";
import ScheduleReportControls from "@/components/staff-schedule-report/ScheduleReportControls";
import ScheduleReportTable from "@/components/staff-schedule-report/ScheduleReportTable";
import StaffComparisonSelector from "@/components/staff-schedule-report/StaffComparisonSelector";
import StaffComparisonSummaryCards from "@/components/staff-schedule-report/StaffComparisonSummaryCards";
import { Info } from "lucide-react";

export default function MultiStaffScheduleReportPage() {
  const [year, setYear] = useState(2026);
  const [groupBy, setGroupBy] = useState<GroupByMode>("MONTH");
  const [startParam, setStartParam] = useState("1"); // or "MON"
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(["1", "2"]);

  const { data, isLoading } = useMultiStaffScheduleReport(selectedStaffIds, year, groupBy);

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
          Personel Karşılaştırma Raporu
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Ekibinizin çalışma saatlerini, vardiya planlarını ve randevu doluluklarını yan yana karşılaştırın.</p>
      </div>

      <StaffComparisonSelector 
        selectedStaffIds={selectedStaffIds} 
        onChange={setSelectedStaffIds} 
      />

      {data && selectedStaffIds.length > 0 && (
        <StaffComparisonSummaryCards data={data} />
      )}

      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-[#1a1a1a] border-l-4 border-gray-400 dark:border-gray-600 rounded-r-xl">
        <Info className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Tarih satırlarına tıklayarak personelin o güne ait vardiyasını <span className="font-semibold text-gray-900 dark:text-white">anında düzenleyebilirsiniz</span>. 
          Değişiklikler yukarıdaki toplam saatlere otomatik yansıyacaktır.
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
            <ScheduleReportTable groupBy={groupBy} data={data} isMulti={true} />
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-gray-400">
              <p>Karşılaştırmak için en az bir personel seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
