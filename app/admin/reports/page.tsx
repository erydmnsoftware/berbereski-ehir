"use client";

import { useState } from "react";
import { ReportDimension } from "@/lib/reports/dimension-schemas";
import DimensionSelector from "@/components/reports/DimensionSelector";
import ChartControlBar from "@/components/reports/ChartControlBar";
import ReportChart from "@/components/reports/ReportChart";
import ReportTable from "@/components/reports/ReportTable";
import EmptyReportState from "@/components/reports/EmptyReportState";
import { useReportTable, useReportChart } from "@/lib/api/reports";
import { Info } from "lucide-react";

export default function ReportsPage() {
  const [dimension, setDimension] = useState<ReportDimension>("SERVICE");
  const [metric, setMetric] = useState<string>("VALUE");
  const [granularity, setGranularity] = useState<string>("DAILY");
  const [dateRangeShortcut, setDateRangeShortcut] = useState<string>("1M");
  const [isChartHidden, setIsChartHidden] = useState<boolean>(false);

  // In a real app, dateRangeShortcut would be converted to actual Date objects.
  // Using fixed dates for mock purposes.
  const dateRange = { from: new Date("2026-03-01"), to: new Date("2026-06-27") };

  const { data: tableData, isLoading: isTableLoading } = useReportTable(dimension, dateRange);
  const { data: chartData, isLoading: isChartLoading } = useReportChart(
    dimension === "CUSTOMERS" ? "NEW_CUSTOMERS" : metric, 
    granularity, 
    dimension, 
    dateRange
  );

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Raporlar & Analitik</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">İşletmenizin performansını, personel satışlarını ve müşteri büyümesini inceleyin.</p>
      </div>

      <DimensionSelector value={dimension} onChange={setDimension} />

      <div className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-[#222] rounded-3xl overflow-hidden shadow-sm">
        <ChartControlBar 
          dimension={dimension}
          metric={metric}
          setMetric={setMetric}
          granularity={granularity}
          setGranularity={setGranularity}
          dateRangeShortcut={dateRangeShortcut}
          setDateRangeShortcut={setDateRangeShortcut}
          isChartHidden={isChartHidden}
          setIsChartHidden={setIsChartHidden}
        />

        {isChartLoading ? (
          <div className="h-[350px] w-full flex items-center justify-center text-gray-400 bg-gray-50/50 dark:bg-[#1a1a1a]/50">Yükleniyor...</div>
        ) : chartData ? (
          <ReportChart data={chartData} isHidden={isChartHidden} />
        ) : null}
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-[#1a1a1a] border-l-4 border-[#B5482E] rounded-r-xl">
        <Info className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Bu analiz tablosu, işletmenizin <span className="font-semibold text-gray-900 dark:text-white">{dimension === 'CUSTOMERS' ? 'Yeni müşteri kazanımlarını' : 'satış ve randevu performansını'}</span> göstermektedir. 
          Grafik üzerindeki Genel Toplam çizgisi, aşağıdaki alt grupların eşzamanlı toplamıdır.
        </p>
      </div>

      <div>
        {isTableLoading ? (
          <div className="h-64 bg-gray-100 dark:bg-[#151515] animate-pulse rounded-3xl" />
        ) : tableData && tableData.rows.length > 0 ? (
          <ReportTable data={tableData} dateRange={dateRange} />
        ) : (
          <EmptyReportState />
        )}
      </div>

    </div>
  );
}
