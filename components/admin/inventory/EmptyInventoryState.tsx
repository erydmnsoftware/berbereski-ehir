import { PackageOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyInventoryStateProps {
  onAddProduct: () => void;
}

export default function EmptyInventoryState({ onAddProduct }: EmptyInventoryStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-[#E7E2DC] dark:border-[#333333] rounded-xl bg-white/50 dark:bg-[#1C1B1A]/50">
      <div className="w-16 h-16 bg-[#F7F5F2] dark:bg-[#2A2928] rounded-full flex items-center justify-center mb-6 shadow-sm">
        <PackageOpen size={32} className="text-[#B5482E]" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2 font-serif">
        Henüz ürün eklemediniz
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 text-sm leading-relaxed">
        Envanterinizi takip etmeye başlamak için ilk ürününüzü ekleyin. Stok seviyelerini, düşük stok uyarılarını ve satış geçmişini buradan yöneteceksiniz.
      </p>
      <Button 
        onClick={onAddProduct}
        className="bg-[#B5482E] hover:bg-[#963c26] text-white px-6 transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        İlk Ürününü Ekle
      </Button>
    </div>
  );
}
