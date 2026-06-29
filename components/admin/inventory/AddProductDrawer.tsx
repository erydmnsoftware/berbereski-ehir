import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAddProduct } from "@/lib/api/inventory";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";

// Frontend'e özel form şeması (API şemasından biraz farklı olabilir)
const addProductSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır"),
  volume: z.number().optional(),
  unit: z.enum(["ml", "gr", "adet"]).default("ml"),
  price: z.number().min(0, "Fiyat geçerli değil"),
  currentStock: z.number().int().min(0, "Stok 0'dan küçük olamaz"),
  lowStockThreshold: z.number().int().min(0),
  description: z.string().optional(),
  isVisibleToCustomers: z.boolean().default(true),
});

type AddProductForm = z.infer<typeof addProductSchema>;

interface AddProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductDrawer({ isOpen, onClose }: AddProductDrawerProps) {
  const { mutateAsync: addProduct, isPending } = useAddProduct();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<AddProductForm>({
    resolver: zodResolver(addProductSchema) as any,
    mode: "onChange",
    defaultValues: {
      unit: "ml",
      currentStock: 0,
      lowStockThreshold: 5,
      isVisibleToCustomers: true,
    }
  });

  const isVisible = watch("isVisibleToCustomers");
  const unit = watch("unit");

  const onSubmit = async (data: AddProductForm) => {
    try {
      await addProduct({
        name: data.name,
        price: data.price,
        currentStock: data.currentStock,
        lowStockThreshold: data.lowStockThreshold,
        isVisibleToCustomers: data.isVisibleToCustomers,
        description: data.description || null,
        volumeMl: data.unit === "ml" ? data.volume || null : null, 
        imageUrl: imagePreview,
        estimatedDaysUntilOutOfStock: null,
      });
      toast.success("Ürün başarıyla eklendi");
      reset();
      setImagePreview(null);
      onClose();
    } catch (error) {
      toast.error("Ürün eklenirken bir hata oluştu");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#151515] text-gray-900 dark:text-gray-100 rounded-2xl border border-gray-200 dark:border-[#333] shadow-2xl">
        <DialogHeader className="mb-6 border-b border-gray-100 dark:border-[#222] pb-4">
          <DialogTitle className="font-serif text-2xl font-bold">Yeni Ürün Ekle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 1. Görsel Yükleme */}
          <div className="flex gap-5 items-center p-4 rounded-xl border border-dashed border-gray-300 dark:border-[#333] bg-gray-50/50 dark:bg-[#1a1a1a]">
            <div className="w-20 h-20 bg-white dark:bg-[#222] rounded-full border border-gray-200 dark:border-[#444] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333] transition-colors relative overflow-hidden shadow-sm">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImagePlus className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-sm font-semibold">Ürün Görseli</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Önerilen boyut: 500x500px, Maksimum 2MB. Sadece JPG, PNG veya WebP yükleyebilirsiniz.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 2. Ürün Adı */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-sm font-semibold">Ürün Adı <span className="text-[#B5482E]">*</span></Label>
              <Input {...register("name")} placeholder="Örn: Matte Clay Wax" className="h-11 bg-gray-50/50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#333] focus-visible:ring-[#B5482E]" />
              {errors.name && <p className="text-xs text-[#B23B3B]">{errors.name.message}</p>}
            </div>

            {/* 3. Hacim/Birim */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Miktar ve Birim</Label>
              <div className="flex gap-2">
                <Input type="number" {...register("volume", { valueAsNumber: true })} placeholder="50" className="h-11 bg-gray-50/50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#333]" />
                <select 
                  {...register("unit")} 
                  className="flex h-11 w-24 rounded-md border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5482E]"
                >
                  <option value="ml">ml</option>
                  <option value="gr">gr</option>
                  <option value="adet">adet</option>
                </select>
              </div>
            </div>

            {/* 4. Fiyat */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Satış Fiyatı (₺) <span className="text-[#B5482E]">*</span></Label>
              <Input type="number" {...register("price", { valueAsNumber: true })} placeholder="0.00" className="h-11 bg-gray-50/50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#333] focus-visible:ring-[#B5482E]" />
              {errors.price && <p className="text-xs text-[#B23B3B]">{errors.price.message}</p>}
            </div>

            {/* 5. Stok Adedi */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Başlangıç Stoku <span className="text-[#B5482E]">*</span></Label>
              <Input type="number" {...register("currentStock", { valueAsNumber: true })} className="h-11 bg-gray-50/50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#333] focus-visible:ring-[#B5482E]" />
              {errors.currentStock && <p className="text-xs text-[#B23B3B]">{errors.currentStock.message}</p>}
            </div>

            {/* Düşük Stok Eşiği */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Düşük Stok Eşiği <span className="text-[#B5482E]">*</span></Label>
              <Input type="number" {...register("lowStockThreshold", { valueAsNumber: true })} className="h-11 bg-gray-50/50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#333] focus-visible:ring-[#B5482E]" />
            </div>
          </div>

          {/* 6. Açıklama */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Açıklama (İsteğe Bağlı)</Label>
            <Textarea 
              {...register("description")} 
              placeholder="Ürünle ilgili kısa bilgiler..." 
              className="resize-none h-24 bg-gray-50/50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#333] focus-visible:ring-[#B5482E]" 
            />
          </div>

          {/* 7. Görünürlük */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#1a1a1a] rounded-xl shadow-sm">
            <div className="space-y-1">
              <Label className="text-sm font-semibold cursor-pointer" htmlFor="visible-toggle">Müşterilere Görünür</Label>
              <p className="text-xs text-gray-500">Bu ürün katalog sayfasında listelensin mi?</p>
            </div>
            <Switch 
              id="visible-toggle"
              checked={isVisible} 
              onCheckedChange={(val) => setValue("isVisibleToCustomers", val, { shouldValidate: true })} 
              className="data-[state=checked]:bg-[#B5482E]"
            />
          </div>

          {/* Actions */}
          <DialogFooter className="mt-8 pt-4 border-t border-gray-100 dark:border-[#222]">
            <div className="w-full flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11 border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300">
                İptal Et
              </Button>
              <Button type="submit" disabled={!isValid || isPending} className="flex-1 h-11 bg-[#B5482E] hover:bg-[#963c26] text-white shadow-sm">
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isPending ? "Ekleniyor..." : "Ürünü Kaydet"}
              </Button>
            </div>
          </DialogFooter>
          
        </form>
      </DialogContent>
    </Dialog>
  );
}
