import { Product } from "@/lib/api/types";
import { TableCell, TableRow } from "@/components/ui/table";
import StockStatusBadge, { getStockStatus } from "./StockStatusBadge";
import ConsumeStockButton from "./ConsumeStockButton";
import { MoreVertical, Package, Edit, Trash, History } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProductRowProps {
  product: Product;
  onAdjustStock: (p: Product) => void;
}

// 1. Masaüstü Görünümü (Table Row)
export function DesktopProductRow({ product, onAdjustStock }: ProductRowProps) {
  const status = getStockStatus(product);
  
  // Sol kenardaki durum şeridi rengi
  let stripeColor = "transparent";
  if (status === "OUT_OF_STOCK" || status === "CRITICAL") stripeColor = "#B23B3B";
  else if (status === "LOW") stripeColor = "#C77F22";

  return (
    <TableRow className="group relative transition-all duration-200 hover:bg-gray-50/80 dark:hover:bg-[#1a1a1a] border-b border-gray-100 dark:border-[#222]">
      {/* Durum Şeridi */}
      <td className="w-0 p-0">
        <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-r-full transition-colors" style={{ backgroundColor: stripeColor }} />
      </td>

      <TableCell className="pl-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#222] flex items-center justify-center overflow-hidden border border-gray-200 dark:border-[#333] flex-shrink-0 shadow-sm">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-lg text-gray-400">{product.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">{product.name}</span>
            {product.volumeMl && <span className="text-xs text-gray-500 font-medium mt-0.5">{product.volumeMl} ml</span>}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="py-5">
        <button
          onClick={() => onAdjustStock(product)}
          className="inline-flex items-center justify-center px-4 py-1.5 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#222] rounded-full text-sm font-semibold transition-all border border-gray-200 dark:border-[#333] shadow-sm hover:shadow"
          aria-label={`${product.name} stok güncelle, mevcut: ${product.currentStock} adet`}
        >
          <Package className="w-4 h-4 mr-2 text-[#B5482E]" />
          {product.currentStock}
        </button>
      </TableCell>

      <TableCell>
        <StockStatusBadge product={product} />
      </TableCell>

      <TableCell className="text-right pr-6">
        <div className="flex items-center justify-end gap-2">
          <ConsumeStockButton product={product} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#222]">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl border-gray-100 dark:border-[#333] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 shadow-lg">
              <DropdownMenuItem className="cursor-pointer py-2 focus:bg-gray-50 dark:focus:bg-[#222]">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 focus:bg-gray-50 dark:focus:bg-[#222]">
                <History className="w-4 h-4 mr-2" />
                Geçmişi Gör
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30">
                <Trash className="w-4 h-4 mr-2" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

// 2. Mobil Görünüm (Card)
export function MobileProductCard({ product, onAdjustStock }: ProductRowProps) {
  const status = getStockStatus(product);
  
  let stripeColor = "transparent";
  if (status === "OUT_OF_STOCK" || status === "CRITICAL") stripeColor = "#B23B3B";
  else if (status === "LOW") stripeColor = "#C77F22";

  return (
    <div className="relative p-5 mb-4 rounded-2xl border border-gray-100 dark:border-[#222] bg-white dark:bg-[#151515] shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* Durum Şeridi */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: stripeColor }} />
      
      <div className="flex justify-between items-start mb-4 pl-2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-[#222] flex items-center justify-center overflow-hidden border border-gray-200 dark:border-[#333] flex-shrink-0 shadow-sm">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-2xl text-gray-400">{product.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight">{product.name}</h4>
            {product.volumeMl && <p className="text-sm text-gray-500 font-medium mt-1">{product.volumeMl} ml</p>}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#222] -mt-1 -mr-2">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl border-gray-100 dark:border-[#333] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 shadow-lg">
            <DropdownMenuItem className="cursor-pointer py-2.5 focus:bg-gray-50 dark:focus:bg-[#222]"><Edit className="w-4 h-4 mr-3" /> Düzenle</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2.5 focus:bg-gray-50 dark:focus:bg-[#222]"><History className="w-4 h-4 mr-3" /> Geçmiş</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"><Trash className="w-4 h-4 mr-3" /> Sil</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="pl-2 flex items-center justify-between mt-3 pt-4 border-t border-gray-100 dark:border-[#222]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onAdjustStock(product)}
            className="inline-flex w-fit items-center px-4 py-2 bg-gray-50 dark:bg-[#222] rounded-full text-sm font-semibold border border-gray-200 dark:border-[#333] shadow-sm active:scale-95 transition-transform"
          >
            <Package className="w-4 h-4 mr-2 text-[#B5482E]" />
            {product.currentStock}
          </button>
          <div className="-mt-1"><StockStatusBadge product={product} /></div>
        </div>
        
        <ConsumeStockButton product={product} />
      </div>
    </div>
  );
}
