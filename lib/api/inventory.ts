import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, StockMovement } from "./types";
import { supabase } from "@/lib/supabase";

// For demo, we are hardcoding the salon_id for now as it's a single tenant app for BerberEskişehir VIP.
// In a multi-tenant app, this would come from auth context.
const SALON_ID = "11111111-1111-1111-1111-111111111111";

// --- Queries ---
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("salon_id", SALON_ID)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw new Error(error.message);
      }

      // Map snake_case to camelCase
      return data.map((p) => ({
        id: p.id,
        name: p.name,
        volumeMl: p.volume_ml,
        imageUrl: p.image_url,
        price: p.price,
        currentStock: p.current_stock,
        lowStockThreshold: p.low_stock_threshold,
        estimatedDaysUntilOutOfStock: p.estimated_days_until_out_of_stock,
        isVisibleToCustomers: p.is_visible_to_customers,
        description: p.description,
        updatedAt: p.updated_at,
        updatedBy: p.updated_by,
      }));
    },
  });
}

// --- Mutations ---
export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, newStock, note, type, quantity }: { productId: string, newStock: number, note?: string, type: StockMovement["type"], quantity: number }) => {
      // 1. Update the product stock
      const { data: productData, error: productError } = await supabase
        .from("products")
        .update({ current_stock: newStock, updated_at: new Date().toISOString(), updated_by: "Admin" })
        .eq("id", productId)
        .select()
        .single();

      if (productError) {
        console.error("Error updating stock:", productError);
        throw new Error(productError.message);
      }

      // 2. Log the stock movement
      const { error: movementError } = await supabase
        .from("stock_movements")
        .insert({
          product_id: productId,
          type: type,
          quantity: quantity,
          note: note,
          performed_by: "Admin"
        });

      if (movementError) {
        console.error("Error logging stock movement:", movementError);
        // We don't throw here to not break the UI if logging fails, but we log it.
      }

      return {
        id: productData.id,
        name: productData.name,
        volumeMl: productData.volume_ml,
        imageUrl: productData.image_url,
        price: productData.price,
        currentStock: productData.current_stock,
        lowStockThreshold: productData.low_stock_threshold,
        estimatedDaysUntilOutOfStock: productData.estimated_days_until_out_of_stock,
        isVisibleToCustomers: productData.is_visible_to_customers,
        description: productData.description,
        updatedAt: productData.updated_at,
        updatedBy: productData.updated_by,
      } as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Omit<Product, "id" | "updatedAt" | "updatedBy">) => {
      const { data, error } = await supabase
        .from("products")
        .insert({
          salon_id: SALON_ID,
          name: newProduct.name,
          volume_ml: newProduct.volumeMl,
          image_url: newProduct.imageUrl,
          price: newProduct.price,
          current_stock: newProduct.currentStock,
          low_stock_threshold: newProduct.lowStockThreshold,
          estimated_days_until_out_of_stock: newProduct.estimatedDaysUntilOutOfStock,
          is_visible_to_customers: newProduct.isVisibleToCustomers,
          description: newProduct.description,
          updated_by: "Admin"
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding product:", error);
        throw new Error(error.message);
      }

      return {
        id: data.id,
        name: data.name,
        volumeMl: data.volume_ml,
        imageUrl: data.image_url,
        price: data.price,
        currentStock: data.current_stock,
        lowStockThreshold: data.low_stock_threshold,
        estimatedDaysUntilOutOfStock: data.estimated_days_until_out_of_stock,
        isVisibleToCustomers: data.is_visible_to_customers,
        description: data.description,
        updatedAt: data.updated_at,
        updatedBy: data.updated_by,
      } as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
