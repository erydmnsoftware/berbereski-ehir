import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Ürün adı zorunludur"),
  volumeMl: z.number().nullable(),
  imageUrl: z.string().nullable(),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  currentStock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  estimatedDaysUntilOutOfStock: z.number().nullable(),
  isVisibleToCustomers: z.boolean(),
  description: z.string().nullable(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string().nullable(),
});

export type Product = z.infer<typeof ProductSchema>;

export const StockMovementSchema = z.object({
  id: z.string(),
  productId: z.string(),
  type: z.enum(["RESTOCK", "CONSUME", "ADJUSTMENT", "SALE"]),
  quantity: z.number(), // pozitif = giriş, negatif = çıkış
  note: z.string().nullable(),
  performedBy: z.string(),
  createdAt: z.string().datetime(),
});

export type StockMovement = z.infer<typeof StockMovementSchema>;
