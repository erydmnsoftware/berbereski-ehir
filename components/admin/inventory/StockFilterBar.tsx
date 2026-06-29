import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type SortOption = "NAME_ASC" | "STOCK_ASC" | "UPDATED_DESC";

interface StockFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortOption: SortOption;
  onSortChange: (val: SortOption) => void;
  showOnlyLowStock: boolean;
  onLowStockToggle: (val: boolean) => void;
}

export default function StockFilterBar({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  showOnlyLowStock,
  onLowStockToggle
}: StockFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-white dark:bg-[#151515] border border-gray-100 dark:border-[#222] rounded-2xl mb-8 shadow-sm transition-all hover:shadow-md">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Envanterde ürün ara..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-11 bg-gray-50/50 dark:bg-[#1a1a1a] rounded-full border-gray-200 dark:border-[#333] focus-visible:ring-[#B5482E] transition-all"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-gray-400" />
          <Select value={sortOption} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-[200px] h-11 rounded-full bg-gray-50/50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] focus:ring-[#B5482E]">
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 dark:border-[#333] shadow-lg">
              <SelectItem value="NAME_ASC" className="cursor-pointer">Ada Göre (A-Z)</SelectItem>
              <SelectItem value="STOCK_ASC" className="cursor-pointer">Stok (Azdan Çoğa)</SelectItem>
              <SelectItem value="UPDATED_DESC" className="cursor-pointer">Son Güncellenen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-[#333] hidden sm:block"></div>

        <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-[#1a1a1a] px-4 py-2.5 rounded-full border border-gray-200 dark:border-[#333] transition-colors hover:bg-gray-100 dark:hover:bg-[#222]">
          <Switch 
            id="low-stock-toggle" 
            checked={showOnlyLowStock}
            onCheckedChange={onLowStockToggle}
            className="data-[state=checked]:bg-[#B5482E]"
          />
          <Label htmlFor="low-stock-toggle" className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300">
            Sadece düşük stok
          </Label>
        </div>
      </div>
    </div>
  );
}
