import { useQuery } from "@tanstack/react-query";
import { ReportTableResponse, ChartDataResponse, ChartSeriesPoint } from "./types/reports";
import { ReportDimension } from "../reports/dimension-schemas";
import { addDays, format } from "date-fns";



// HOOKS

export function useReportTable(dimension: ReportDimension, dateRange: {from: Date, to: Date}) {
  return useQuery({
    queryKey: ["reportTable", dimension, dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const res = await fetch(`/api/reports/table?dimension=${dimension}&from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`);
      if (!res.ok) throw new Error('Rapor alınamadı');
      return res.json();
    }
  });
}

export function useReportChart(metric: string, granularity: string, dimension: ReportDimension, dateRange: {from: Date, to: Date}) {
  return useQuery({
    queryKey: ["reportChart", metric, granularity, dimension, dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const res = await fetch(`/api/reports/chart?metric=${metric}&dimension=${dimension}&granularity=${granularity}&from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`);
      if (!res.ok) throw new Error('Grafik alınamadı');
      return res.json();
    }
  });
}
