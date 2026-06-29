"use client";

import { useRef, useState, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { 
  StaffScheduleReport, 
  MultiStaffScheduleReport, 
  GroupByMode,
  PeriodSummary,
  DayEntry
} from "@/lib/api/types/staff-schedule";
import { ChevronDown, ChevronRight, CircleDot } from "lucide-react";
import DayShiftEditPopover from "./DayShiftEditPopover";

interface ScheduleReportTableProps {
  groupBy: GroupByMode;
  data: StaffScheduleReport | MultiStaffScheduleReport;
  isMulti: boolean;
}

// Flat Row Types for Virtualization
type RowItem = 
  | { type: "PERIOD"; period: PeriodSummary; isExpanded: boolean; staffId?: string; staffName?: string }
  | { type: "STAFF_HEADER"; staffName: string }
  | { type: "DAY"; day: DayEntry; staffId: string };

export default function ScheduleReportTable({ groupBy, data, isMulti }: ScheduleReportTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Expanded State (PeriodKey -> boolean)
  // Initially, we can expand the first period
  const initialExpanded = useMemo(() => {
    const s = new Set<string>();
    if (isMulti) {
      const msData = data as MultiStaffScheduleReport;
      if (msData.staffReports.length > 0 && msData.staffReports[0].periods.length > 0) {
        s.add(msData.staffReports[0].periods[0].periodKey);
      }
    } else {
      const sData = data as StaffScheduleReport;
      if (sData.periods.length > 0) s.add(sData.periods[0].periodKey);
    }
    return s;
  }, [data, isMulti]);

  const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(initialExpanded);

  const togglePeriod = (periodKey: string) => {
    setExpandedPeriods(prev => {
      const next = new Set(prev);
      if (next.has(periodKey)) next.delete(periodKey);
      else next.add(periodKey);
      return next;
    });
  };

  const toggleAll = (expand: boolean) => {
    if (!expand) {
      setExpandedPeriods(new Set());
      return;
    }
    const next = new Set<string>();
    if (isMulti) {
      const msData = data as MultiStaffScheduleReport;
      msData.staffReports.forEach(r => r.periods.forEach(p => next.add(p.periodKey)));
    } else {
      const sData = data as StaffScheduleReport;
      sData.periods.forEach(p => next.add(p.periodKey));
    }
    setExpandedPeriods(next);
  };

  // Flatten the data for virtualization
  const rows = useMemo(() => {
    const flat: RowItem[] = [];

    if (!isMulti) {
      const sData = data as StaffScheduleReport;
      sData.periods.forEach(period => {
        const isExpanded = expandedPeriods.has(period.periodKey);
        flat.push({ type: "PERIOD", period, isExpanded, staffId: sData.staffId, staffName: sData.staffName });
        
        if (isExpanded) {
          period.days.forEach(day => {
            flat.push({ type: "DAY", day, staffId: sData.staffId });
          });
        }
      });
    } else {
      const msData = data as MultiStaffScheduleReport;
      // For multi, we iterate periods first, then staff
      // To do this, we collect all unique periods from the first staff report (assuming all have same periods)
      if (msData.staffReports.length > 0) {
        const periodsKeys = msData.staffReports[0].periods.map(p => p.periodKey);
        
        periodsKeys.forEach(pKey => {
          const isExpanded = expandedPeriods.has(pKey);
          
          // Render a master period row aggregating the totals? 
          // Or just a header for the period. Let's just use the first staff's period info for the label.
          const refPeriod = msData.staffReports[0].periods.find(p => p.periodKey === pKey)!;
          
          // Master period header for Multi-mode
          flat.push({ type: "PERIOD", period: refPeriod, isExpanded });

          if (isExpanded) {
            msData.staffReports.forEach(staff => {
              const staffPeriod = staff.periods.find(p => p.periodKey === pKey);
              if (staffPeriod) {
                flat.push({ type: "STAFF_HEADER", staffName: staff.staffName });
                staffPeriod.days.forEach(day => {
                  flat.push({ type: "DAY", day, staffId: staff.staffId });
                });
              }
            });
          }
        });
      }
    }

    return flat;
  }, [data, isMulti, expandedPeriods]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // default height
    overscan: 10,
  });

  const firstColumnHeader = groupBy === "MONTH" ? "Ay" : "Hafta Başlangıcı";

  return (
    <div className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-[#222] rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#1a1a1a]/50">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {isMulti ? "Personel Karşılaştırması" : `${(data as StaffScheduleReport).staffName} - Çalışma Saatleri Raporu`}
        </h3>
        <div className="flex gap-3">
          <button onClick={() => toggleAll(true)} className="text-sm font-semibold text-[#B5482E] hover:underline">Tümünü Genişlet</button>
          <span className="text-gray-300 dark:text-[#333]">|</span>
          <button onClick={() => toggleAll(false)} className="text-sm font-semibold text-gray-500 hover:underline">Tümünü Kapat</button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#1a1a1a] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0 z-10">
        <div className="col-span-1">{firstColumnHeader}</div>
        <div className="col-span-1 text-center">Tüm gün blokları</div>
        <div className="col-span-1 text-center">Personel vardiya saatleri</div>
        <div className="col-span-1 text-center">Randevu blokları</div>
        <div className="col-span-1 text-center">Çalışılan saatler</div>
      </div>

      {/* Virtualized Body */}
      <div 
        ref={parentRef} 
        className="overflow-auto"
        style={{ height: '600px' }} // Fixed height for virtualizer window
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const row = rows[virtualItem.index];

            return (
              <div
                key={virtualItem.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {row.type === "PERIOD" && (
                  <div 
                    onClick={() => togglePeriod(row.period.periodKey)}
                    className="grid grid-cols-5 gap-4 px-6 items-center border-b border-gray-100 dark:border-[#222] bg-white dark:bg-[#151515] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors group h-full"
                  >
                    <div className="col-span-1 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                      {row.isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-900" /> : <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />}
                      {row.period.periodLabel}
                    </div>
                    
                    {/* Aggregated view for single mode, or we can just leave it blank for multi master row depending on design. We'll render for both. */}
                    <div className="col-span-1 text-center font-medium text-gray-600 dark:text-gray-300">
                      {row.period.dayBlockedCount > 0 ? `${row.period.dayBlockedCount} gün bloke` : "-"}
                    </div>
                    <div className="col-span-1 text-center font-bold text-gray-900 dark:text-white">
                      {row.period.scheduledHours} saatler
                    </div>
                    <div className="col-span-1 text-center font-bold text-[#B5482E]">
                      {row.period.bookedHours} saatler
                    </div>
                    <div className="col-span-1 text-center font-bold text-gray-900 dark:text-white flex justify-between items-center pr-4">
                      <span>{row.period.workedHours} saatler</span>
                      <span className="text-xs font-semibold text-[#B5482E] opacity-0 group-hover:opacity-100 transition-opacity">
                        {row.isExpanded ? "Yıkmak ⌃" : "Genişlet ⌄"}
                      </span>
                    </div>
                  </div>
                )}

                {row.type === "STAFF_HEADER" && (
                  <div className="flex items-center px-6 border-b border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#1a1a1a]/50 h-full">
                    <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {row.staffName}
                    </span>
                  </div>
                )}

                {row.type === "DAY" && (
                  <DayShiftEditPopover staffId={row.staffId} day={row.day}>
                    <div className="grid grid-cols-5 gap-4 px-6 items-center border-b border-gray-100 dark:border-[#222] bg-gray-50/80 dark:bg-[#111]/80 hover:bg-gray-100 dark:hover:bg-[#222] cursor-pointer transition-colors h-full text-sm">
                      <div className="col-span-1 flex items-center gap-3 pl-6">
                        <StatusDot status={row.day.status} />
                        <span className="font-semibold text-gray-700 dark:text-gray-200">{row.day.dayLabel}</span>
                      </div>
                      <div className="col-span-1 text-center text-gray-500">
                        {row.day.status === "DAY_BLOCKED" ? "Tüm gün bloklu" : "-"}
                      </div>
                      <div className="col-span-1 text-center font-medium text-gray-900 dark:text-white">
                        {row.day.status === "CLOSED" ? (
                          <span className="text-gray-400">Kapalı (0 saatler)</span>
                        ) : row.day.status === "DAY_BLOCKED" ? (
                          <span className="text-amber-600 dark:text-amber-500">Bloklu</span>
                        ) : (
                          <span>{row.day.shiftStart} - {row.day.shiftEnd}</span>
                        )}
                      </div>
                      <div className="col-span-1 text-center text-[#B5482E] font-medium">
                        {row.day.bookedHours > 0 ? `${row.day.bookedHours} saatler` : "-"}
                      </div>
                      <div className="col-span-1 text-center font-medium text-gray-900 dark:text-white">
                        {row.day.workedHours > 0 ? `${row.day.workedHours} saatler` : <span className="text-gray-400">0 saatler</span>}
                      </div>
                    </div>
                  </DayShiftEditPopover>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  if (status === "CLOSED") return <CircleDot className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />;
  if (status === "SCHEDULED") return <CircleDot className="w-3.5 h-3.5 text-emerald-500" />;
  if (status === "DAY_BLOCKED") return <CircleDot className="w-3.5 h-3.5 text-amber-500" />;
  return null;
}
