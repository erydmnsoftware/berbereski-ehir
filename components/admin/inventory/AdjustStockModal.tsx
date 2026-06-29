import { useState } from "react";
import { Product } from "@/lib/api/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateStock } from "@/lib/api/inventory";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AdjustStockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdjustStockModal({ product, isOpen, onClose }: AdjustStockModalProps) {
  const { mutateAsync: updateStock, isPending } = useUpdateStock();
  const [activeTab, setActiveTab] = useState<"RESTOCK" | "CONSUME" | "ADJUSTMENT">("RESTOCK");
  
  // Form states
  const [quantityStr, setQuantityStr] = useState("");
  const [note, setNote] = useState("");

  if (!product) return null;

  const quantity = parseInt(quantityStr) || 0;

  // Hesaplamalar
  let newStock = product.currentStock;
  if (activeTab === "RESTOCK") newStock += quantity;
  else if (activeTab === "CONSUME") newStock = Math.max(0, product.currentStock - quantity);
  else if (activeTab === "ADJUSTMENT") newStock = quantityStr === "" ? product.currentStock : quantity;

  const handleSave = async () => {
    if (activeTab !== "ADJUSTMENT" && quantity <= 0) {
      toast.error("Lütfen geçerli bir miktar girin");
      return;
    }
    
    try {
      await updateStock({
        productId: product.id,
        newStock,
        type: activeTab,
        quantity: activeTab === "CONSUME" ? -quantity : quantity,
        note: note || undefined,
      });
      toast.success(`Stok güncellendi: ${newStock} adet`);
      handleClose();
    } catch (error) {
      toast.error("Stok güncellenirken bir hata oluştu");
    }
  };

  const handleClose = () => {
    setQuantityStr("");
    setNote("");
    setActiveTab("RESTOCK");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#151515] text-gray-900 dark:text-gray-100 rounded-2xl border-gray-200 dark:border-[#333] shadow-2xl">
        <DialogHeader className="border-b border-gray-100 dark:border-[#222] pb-4 mb-2">
          <DialogTitle className="font-serif text-2xl font-bold">
            {product.name}
          </DialogTitle>
          <div className="text-sm text-gray-500 font-medium">Hızlı Stok İşlemi</div>
        </DialogHeader>

        <div className="py-2 space-y-5">
          <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#333] shadow-sm">
            <span className="text-gray-500 text-sm font-semibold">Mevcut Stok</span>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900 dark:text-white mr-1.5">{product.currentStock}</span>
              <span className="text-sm text-gray-500 font-medium">adet</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setQuantityStr(""); }} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 dark:bg-[#222] p-1.5 rounded-lg mb-5">
              <TabsTrigger value="RESTOCK" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-[#333] data-[state=active]:text-[#3D7A5C] data-[state=active]:shadow-sm">Giriş</TabsTrigger>
              <TabsTrigger value="CONSUME" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-[#333] data-[state=active]:text-[#B23B3B] data-[state=active]:shadow-sm">Çıkış</TabsTrigger>
              <TabsTrigger value="ADJUSTMENT" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-[#333] data-[state=active]:text-[#B5482E] data-[state=active]:shadow-sm">Düzelt</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">
                  {activeTab === "RESTOCK" ? "Kaç adet eklendi? (+)" : 
                   activeTab === "CONSUME" ? "Kaç adet düşülecek? (-)" : 
                   "Yeni stok miktarı (Tam Sayı)"}
                </Label>
                <Input 
                  type="number" 
                  value={quantityStr}
                  onChange={(e) => setQuantityStr(e.target.value)}
                  placeholder="0"
                  className="h-11 bg-gray-50/80 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#333] text-lg font-medium focus-visible:ring-[#B5482E]"
                  min="0"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Not (Opsiyonel)</Label>
                <Textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    activeTab === "RESTOCK" ? "Tedarikçi bilgisi vb." : 
                    activeTab === "CONSUME" ? "Kırılma, fire, numune vb." : 
                    "Sayım sonucu düzeltmesi"
                  }
                  className="resize-none h-16 bg-gray-50/80 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#333] focus-visible:ring-[#B5482E]" 
                />
              </div>
            </div>
            
            {quantityStr && (
              <div className="mt-6 text-center text-sm p-3 bg-gray-50/50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-[#333]">
                Yeni stok: <span className="font-semibold text-gray-900 dark:text-white mx-1">{product.currentStock} {activeTab === "RESTOCK" ? "+" : activeTab === "CONSUME" ? "-" : "→"} {quantity}</span> = 
                <span className={`text-xl font-bold ml-2 ${
                  newStock > product.currentStock ? "text-[#3D7A5C]" : 
                  newStock < product.currentStock ? "text-[#B23B3B]" : "text-[#B5482E]"
                }`}>{newStock}</span>
              </div>
            )}
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100 dark:border-[#222]">
          <Button variant="outline" onClick={handleClose} className="h-10 border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222]">İptal Et</Button>
          <Button 
            onClick={handleSave} 
            disabled={isPending || (!quantityStr && activeTab !== "ADJUSTMENT")}
            className="h-10 px-6 bg-[#B5482E] hover:bg-[#963c26] text-white shadow-sm"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Değişikliği Kaydet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
