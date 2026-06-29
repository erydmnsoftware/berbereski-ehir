"use client";

import { Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ReportDimension } from "@/lib/reports/dimension-schemas";
import { format } from "date-fns";
import { toast } from "sonner";

interface ExportMenuProps {
  dimension: ReportDimension;
  groupKey?: string; // If undefined, implies "Genel Toplam" / Export All
  dateRange: { from: Date; to: Date };
  label?: string; // e.g., "Tümünü dışa aktar"
}

export default function ExportMenu({ dimension, groupKey, dateRange, label }: ExportMenuProps) {
  
  const handleExport = async (formatType: "csv" | "xlsx") => {
    toast.info(`${formatType.toUpperCase()} olarak dışa aktarılıyor...`);
    
    try {
      const fromStr = format(dateRange.from, "yyyy-MM-dd");
      const toStr = format(dateRange.to, "yyyy-MM-dd");
      const endpoint = `/api/reports/export?dimension=${dimension}&from=${fromStr}&to=${toStr}&format=${formatType}${groupKey ? `&groupKey=${encodeURIComponent(groupKey)}` : ''}`;
      
      // MOCK: Geliştirme aşamasında doğrudan lib/reports/export-utils.ts'yi çağıran bir mantık burada devreye girebilir
      // veya mock bir setTimeout kullanılabilir. Gerçek senaryoda window.location.href = endpoint veya blob indirilir.
      console.log("Export triggered for URL:", endpoint);
      
      // Simülasyon
      await new Promise(r => setTimeout(r, 1000));
      toast.success(`Dışa aktarma tamamlandı (${formatType})`);
    } catch (e) {
      toast.error("Dışa aktarılırken bir hata oluştu.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs font-semibold text-[#B5482E] hover:text-[#9A3C25] transition-colors outline-none">
        <Download className="w-3.5 h-3.5" />
        {label || "Dışa Aktar"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 dark:bg-[#1a1a1a]">
        <DropdownMenuItem onClick={() => handleExport("csv")} className="cursor-pointer">
          CSV olarak indir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xlsx")} className="cursor-pointer">
          Excel olarak indir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
