import { Product } from "@/lib/api/types";
import { DesktopProductRow, MobileProductCard } from "./ProductRow";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyInventoryState from "./EmptyInventoryState";

interface ProductTableProps {
  products: Product[];
  onAdjustStock: (p: Product) => void;
  onAddProduct: () => void;
  isLoading?: boolean;
}

export default function ProductTable({ products, onAdjustStock, onAddProduct, isLoading }: ProductTableProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#B5482E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyInventoryState onAddProduct={onAddProduct} />;
  }

  if (isDesktop) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-[#222] bg-white dark:bg-[#151515] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <Table>
          <TableHeader className="bg-gray-50/80 dark:bg-[#1a1a1a]">
            <TableRow className="border-b border-gray-100 dark:border-[#222]">
              <TableHead className="w-0 p-0"></TableHead>
              <TableHead className="pl-8 py-5 font-semibold text-gray-600 dark:text-gray-400">Ürün Adı</TableHead>
              <TableHead className="w-[15%] py-5 font-semibold text-gray-600 dark:text-gray-400">Stok</TableHead>
              <TableHead className="w-[20%] py-5 font-semibold text-gray-600 dark:text-gray-400">Durum</TableHead>
              <TableHead className="text-right pr-8 py-5 font-semibold text-gray-600 dark:text-gray-400">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <DesktopProductRow key={product.id} product={product} onAdjustStock={onAdjustStock} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Mobil Görünüm
  return (
    <div className="flex flex-col w-full">
      {products.map((product) => (
        <MobileProductCard key={product.id} product={product} onAdjustStock={onAdjustStock} />
      ))}
    </div>
  );
}
