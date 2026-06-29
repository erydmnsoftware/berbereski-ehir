import { Product } from "@/lib/api/types";
import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";

type StockStatus = "OUT_OF_STOCK" | "CRITICAL" | "LOW" | "HEALTHY";

export function getStockStatus(product: Product): StockStatus {
  if (product.currentStock === 0) return "OUT_OF_STOCK";
  if (product.currentStock <= product.lowStockThreshold / 2) return "CRITICAL";
  if (product.currentStock <= product.lowStockThreshold) return "LOW";
  return "HEALTHY";
}

export default function StockStatusBadge({ product }: { product: Product }) {
  const status = getStockStatus(product);

  if (status === "HEALTHY") {
    return null; // Görsel gürültü yaratmamak için sağlıklı stokta rozet gizli
  }

  const getStatusConfig = () => {
    switch (status) {
      case "OUT_OF_STOCK":
        return {
          text: "Stokta yok",
          classes: "bg-[#B23B3B] text-white border-transparent",
          icon: <XCircle size={14} className="mr-1" />,
        };
      case "CRITICAL":
        return {
          text: "Kritik seviye",
          classes: "bg-transparent text-[#B23B3B] border-[#B23B3B]",
          icon: <AlertCircle size={14} className="mr-1" />,
        };
      case "LOW":
        return {
          text: "Stok azalıyor",
          classes: "bg-[#C77F22]/10 text-[#C77F22] border-[#C77F22]/20",
          icon: <AlertTriangle size={14} className="mr-1" />,
        };
    }
  };

  const config = getStatusConfig();
  const estimationText = product.estimatedDaysUntilOutOfStock 
    ? `~${product.estimatedDaysUntilOutOfStock} gün içinde tükenir` 
    : null;

  return (
    <div className="flex flex-col items-start">
      <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.classes}`}>
        {config.icon}
        {config.text}
      </div>
      {estimationText && (status === "LOW" || status === "CRITICAL") && (
        <span className="text-[10px] text-[#6b6b6b] mt-1 ml-1">{estimationText}</span>
      )}
    </div>
  );
}
