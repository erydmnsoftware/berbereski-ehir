import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ReportTableResponse } from "../api/types/reports";
import { DIMENSION_CONFIGS, COLUMN_LABELS } from "./dimension-schemas";

/**
 * Downloads a CSV string as a file.
 * Adds UTF-8 BOM so Excel handles Turkish characters properly.
 */
function downloadCsv(csvContent: string, filename: string) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads a workbook as an XLSX file.
 */
function downloadXlsx(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}

/**
 * Translates ReportTableResponse rows to an array of objects for export.
 * Note: In a real system for "Export All", we would call the backend /reports/export endpoint.
 * This is a helper if frontend needs to export its paginated data directly.
 */
export function buildExportData(data: ReportTableResponse) {
  const config = DIMENSION_CONFIGS[data.dimension];
  const columns = config.visibleColumns;
  
  const formattedData = [...data.rows, data.grandTotal].map(row => {
    const rowObj: Record<string, any> = {
      [config.groupLabel]: row.groupKey
    };
    
    columns.forEach(col => {
      let val = 0;
      switch (col) {
        case "TOTAL": val = row.total; break;
        case "CANCELLED": val = row.cancelled ?? 0; break;
        case "NO_SHOW": val = row.noShow ?? 0; break;
        case "CUSTOMERS": val = row.customers ?? 0; break;
        case "AVG_TICKET": val = row.avgTicket ?? 0; break;
        case "HOURS_SOLD": val = row.hoursSold ?? 0; break;
        case "NEW_SIGNUPS": val = row.newSignups ?? 0; break;
      }
      rowObj[COLUMN_LABELS[col]] = val;
    });
    
    return rowObj;
  });

  return formattedData;
}

export function exportToCsv(data: ReportTableResponse, filename: string) {
  const exportData = buildExportData(data);
  const csv = Papa.unparse(exportData);
  downloadCsv(csv, filename);
}

export function exportToXlsx(data: ReportTableResponse, filename: string) {
  const exportData = buildExportData(data);
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rapor");
  downloadXlsx(workbook, filename);
}
