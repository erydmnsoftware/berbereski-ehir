"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProducts } from "@/lib/api/inventory";
import { Product } from "@/lib/api/types";
import ProductTable from "@/components/admin/inventory/ProductTable";
import StockFilterBar, { SortOption } from "@/components/admin/inventory/StockFilterBar";
import AddProductDrawer from "@/components/admin/inventory/AddProductDrawer";
import AdjustStockModal from "@/components/admin/inventory/AdjustStockModal";
import { getStockStatus } from "@/components/admin/inventory/StockStatusBadge";

export default function InventoryPage() {
  const { data: products = [], isLoading } = useProducts();
  
  // UI States
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  
  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("NAME_ASC");
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  // Derived Data
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // 2. Low stock filter
    if (showOnlyLowStock) {
      result = result.filter(p => {
        const status = getStockStatus(p);
        return status === "LOW" || status === "CRITICAL" || status === "OUT_OF_STOCK";
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortOption === "NAME_ASC") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "STOCK_ASC") {
        return a.currentStock - b.currentStock;
      } else if (sortOption === "UPDATED_DESC") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });

    return result;
  }, [products, searchQuery, sortOption, showOnlyLowStock]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Tüm Ürünler</h2>
          <p className="text-sm text-gray-500 mt-1">Stoktaki tüm ürünleri ve malzemeleri yönetin.</p>
        </div>
        <Button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="bg-[#B5482E] hover:bg-[#963c26] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ürün Ekle
        </Button>
      </div>

      <StockFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        showOnlyLowStock={showOnlyLowStock}
        onLowStockToggle={setShowOnlyLowStock}
      />

      <ProductTable 
        products={filteredAndSortedProducts} 
        isLoading={isLoading} 
        onAdjustStock={(product) => setAdjustModalProduct(product)} 
        onAddProduct={() => setIsAddDrawerOpen(true)}
      />

      <AddProductDrawer 
        isOpen={isAddDrawerOpen} 
        onClose={() => setIsAddDrawerOpen(false)} 
      />

      <AdjustStockModal 
        product={adjustModalProduct} 
        isOpen={!!adjustModalProduct} 
        onClose={() => setAdjustModalProduct(null)} 
      />
    </div>
  );
}
