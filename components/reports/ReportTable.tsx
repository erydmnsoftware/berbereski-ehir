"use client";

import { ReportDimension, DIMENSION_CONFIGS, COLUMN_LABELS, ReportColumn } from "@/lib/reports/dimension-schemas";
import { ReportTableResponse, ReportRow } from "@/lib/api/types/reports";
import ExportMenu from "./ExportMenu";

interface ReportTableProps {
  data: ReportTableResponse;
  dateRange: { from: Date; to: Date };
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(val);
}

function formatNumber(val: number) {
  return new Intl.NumberFormat("tr-TR").format(val);
}

export default function ReportTable({ data, dateRange }: ReportTableProps) {
  const config = DIMENSION_CONFIGS[data.dimension];
  const columns = config.visibleColumns;

  const renderCell = (col: ReportColumn, row: ReportRow, isTotal: boolean = false) => {
    let val: number | null = 0;
    switch (col) {
      case "TOTAL": val = row.total; break;
      case "CANCELLED": val = row.cancelled; break;
      case "NO_SHOW": val = row.noShow; break;
      case "CUSTOMERS": val = row.customers; break;
      case "AVG_TICKET": val = row.avgTicket; break;
      case "HOURS_SOLD": val = row.hoursSold; break;
      case "NEW_SIGNUPS": val = row.newSignups; break;
    }

    if (val === null || val === undefined) {
      return <td key={col} className={`p-4 ${isTotal ? "font-bold text-gray-900 dark:text-white" : "text-gray-500"} text-center`}>-</td>;
    }

    if (col === "TOTAL" || col === "AVG_TICKET") {
      return (
        <td key={col} className={`p-4 text-right ${isTotal ? "font-bold text-gray-900 dark:text-white" : "font-semibold text-gray-900 dark:text-gray-200"}`}>
          {formatCurrency(val)}
        </td>
      );
    }

    return (
      <td key={col} className={`p-4 text-center ${isTotal ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-600 dark:text-gray-300"}`}>
        {formatNumber(val)}
      </td>
    );
  };

  return (
    <div className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-[#222] rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">{config.groupLabel}</th>
              {columns.map(col => (
                <th key={col} className={`p-4 font-semibold ${col === "TOTAL" || col === "AVG_TICKET" ? "text-right" : "text-center"}`}>
                  {COLUMN_LABELS[col]}
                </th>
              ))}
              <th className="p-4 font-semibold text-right w-32">Dışa Aktar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
            {data.rows.map((row) => (
              <tr key={row.groupKey} className="hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a]/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.groupColor }} />
                  {row.groupKey}
                </td>
                {columns.map(col => renderCell(col, row))}
                <td className="p-4 text-right">
                  <ExportMenu dimension={data.dimension} groupKey={row.groupKey} dateRange={dateRange} />
                </td>
              </tr>
            ))}
            
            {/* Grand Total Row */}
            {data.grandTotal && (
              <tr className="bg-gray-50/50 dark:bg-[#1a1a1a]/80 border-t-2 border-gray-200 dark:border-[#333]">
                <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-white" />
                  {data.grandTotal.groupKey}
                </td>
                {columns.map(col => renderCell(col, data.grandTotal, true))}
                <td className="p-4 text-right">
                  <ExportMenu dimension={data.dimension} dateRange={dateRange} label="Tümünü Aktar" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
