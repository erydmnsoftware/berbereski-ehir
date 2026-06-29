import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api/types";
import { Droplets, Loader2, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateStock } from "@/lib/api/inventory";
import { toast } from "sonner";

export default function ConsumeStockButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const { mutateAsync: updateStock, isPending } = useUpdateStock();
  
  const disabled = product.currentStock === 0;

  const handleConsume = async () => {
    const q = parseInt(quantity);
    if (!q || q <= 0 || q > product.currentStock) {
      toast.error("Geçerli bir miktar girin");
      return;
    }

    try {
      await updateStock({
        productId: product.id,
        newStock: product.currentStock - q,
        type: "CONSUME",
        quantity: -q,
        note: "İç kullanım",
      });
      toast.success(`${q} adet stoktan düşüldü`);
      setOpen(false);
      setQuantity("1");
    } catch (error) {
      toast.error("İşlem başarısız oldu");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={disabled}
          className="border-[#E7E2DC] text-gray-700 hover:bg-gray-50 dark:border-[#333333] dark:text-gray-300 dark:hover:bg-[#2A2928]"
        >
          <Droplets className="w-3.5 h-3.5 mr-1.5" />
          Stoktan Düş
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-5 rounded-2xl border-gray-100 dark:border-[#333] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 shadow-xl" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">Hızlı Kullanım</h4>
            <p className="text-xs text-gray-500 mt-1 font-medium">Mevcut stok: {product.currentStock}</p>
          </div>
          <div className="flex gap-2 items-end">
            <div className="space-y-1.5 flex-1">
              <Label className="text-xs">Kullanılan Adet</Label>
              <Input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max={product.currentStock}
                className="h-8 text-sm"
              />
            </div>
            <Button 
              size="sm" 
              onClick={handleConsume}
              disabled={isPending}
              className="bg-[#B5482E] hover:bg-[#963c26] text-white h-8 w-8 px-0"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
