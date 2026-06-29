"use client";

import { ReportDimension } from "@/lib/reports/dimension-schemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye, Calendar, Search } from "lucide-react";

interface ChartControlBarProps {
  dimension: ReportDimension;
  metric: string;
  setMetric: (val: string) => void;
  granularity: string;
  setGranularity: (val: string) => void;
  dateRangeShortcut: string;
  setDateRangeShortcut: (val: string) => void;
  isChartHidden: boolean;
  setIsChartHidden: (val: boolean) => void;
}

export default function ChartControlBar({
  dimension,
  metric,
  setMetric,
  granularity,
  setGranularity,
  dateRangeShortcut,
  setDateRangeShortcut,
  isChartHidden,
  setIsChartHidden
}: ChartControlBarProps) {
  
  // If dimension is CUSTOMERS, metric is locked to NEW_CUSTOMERS.
  const isCustomers = dimension === "CUSTOMERS";
  const displayMetric = isCustomers ? "NEW_CUSTOMERS" : metric;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-[#151515] border-b border-gray-100 dark:border-[#222]">
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Metric Selector */}
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-1 border border-gray-200 dark:border-[#333]">
          <Search className="w-4 h-4 text-gray-500 ml-2" />
          <Select 
            value={displayMetric} 
            onValueChange={setMetric}
            disabled={isCustomers}
          >
            <SelectTrigger className="w-[180px] border-0 bg-transparent focus:ring-0 shadow-none font-semibold text-gray-700 dark:text-gray-200">
              <SelectValue placeholder="Değer seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VALUE">Ciro (₺)</SelectItem>
              <SelectItem value="BOOKINGS_COUNT">Randevu Sayısı</SelectItem>
              <SelectItem value="NEW_CUSTOMERS">Yeni Müşteri</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Granularity Selector */}
        <Select value={granularity} onValueChange={setGranularity}>
          <SelectTrigger className="w-[120px] bg-white dark:bg-[#111] border-gray-200 dark:border-[#333] font-medium">
            <SelectValue placeholder="Periyot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAILY">Günlük</SelectItem>
            <SelectItem value="WEEKLY">Haftalık</SelectItem>
            <SelectItem value="MONTHLY">Aylık</SelectItem>
            <SelectItem value="YEARLY">Yıllık</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Shortcut Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-lg px-3">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Select value={dateRangeShortcut} onValueChange={setDateRangeShortcut}>
            <SelectTrigger className="w-[140px] border-0 bg-transparent focus:ring-0 shadow-none font-medium px-0">
              <SelectValue placeholder="Tarih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7D">Son 7 Gün</SelectItem>
              <SelectItem value="1M">Son 1 Ay</SelectItem>
              <SelectItem value="3M">Son 3 Ay</SelectItem>
              <SelectItem value="1Y">Son 1 Yıl</SelectItem>
              <SelectItem value="YTD">Bu Yıl</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsChartHidden(!isChartHidden)}
        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
      >
        {isChartHidden ? (
          <><Eye className="w-4 h-4 mr-2" /> Grafiği Göster</>
        ) : (
          <><EyeOff className="w-4 h-4 mr-2" /> Grafiği Gizle</>
        )}
      </Button>

    </div>
  );
}
