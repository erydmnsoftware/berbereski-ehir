import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shop, Service, Barber, BillingDetails } from "./types/business";
import { toast } from "sonner";



// HOOKS

export function useShops() {
  return useQuery({
    queryKey: ["business-shops"],
    queryFn: async () => {
      const response = await fetch('/api/business/shops');
      if (!response.ok) {
        throw new Error('Mağazalar yüklenemedi');
      }
      return response.json();
    }
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/business/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!response.ok) throw new Error('Mağaza oluşturulamadı');
      return response.json();
    },
    onSuccess: () => {
      toast.success("Yeni mağaza oluşturuldu.");
      queryClient.invalidateQueries({ queryKey: ["business-shops"] });
    }
  });
}

export function useUpdateShopDetails(shopId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Shop>) => {
      const response = await fetch(`/api/business/shops/${shopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Değişiklikler kaydedilemedi');
      return response.json();
    },
    onSuccess: () => {
      toast.success("Değişiklikler kaydedildi.");
      queryClient.invalidateQueries({ queryKey: ["business-shops"] });
    }
  });
}

export function useReorderServices(shopId: string, barberId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const response = await fetch(`/api/business/shops/${shopId}/barbers/${barberId}/services/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedServiceIds: orderedIds })
      });
      if (!response.ok) throw new Error('Sıralama güncellenemedi');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-shops"] });
    }
  });
}

export function useToggleOnlineBooking(shopId: string, barberId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ serviceId, isOnline }: { serviceId: string, isOnline: boolean }) => {
      const response = await fetch(`/api/business/shops/${shopId}/barbers/${barberId}/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isOnline }) // Map to DB column
      });
      if (!response.ok) throw new Error('Durum güncellenemedi');
      return response.json();
    },
    onSuccess: () => {
      toast.success("Durum güncellendi.");
      queryClient.invalidateQueries({ queryKey: ["business-shops"] });
    }
  });
}

export function useDeleteShop(shopId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/business/shops/${shopId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Mağaza silinemedi');
      return true;
    },
    onSuccess: () => {
      toast.success("Mağaza kalıcı olarak silindi.");
      queryClient.invalidateQueries({ queryKey: ["business-shops"] });
    }
  });
}

export function useBillingDetails(shopId: string) {
  return useQuery({
    queryKey: ["billing-details", shopId],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 600));
      
      const details: BillingDetails = {
        currentPlan: {
          id: "plan-pro",
          name: "Pro Plan",
          priceMonthly: 499,
          features: ["Sınırsız Personel", "Gelişmiş Raporlar", "Online Rezervasyon", "Özel Domain"]
        },
        availablePlans: [
          {
            id: "plan-basic",
            name: "Temel Plan",
            priceMonthly: 199,
            features: ["1 Personel", "Temel Raporlar", "Online Rezervasyon"]
          },
          {
            id: "plan-pro",
            name: "Pro Plan",
            priceMonthly: 499,
            features: ["Sınırsız Personel", "Gelişmiş Raporlar", "Online Rezervasyon", "Özel Domain"]
          }
        ],
        subscription: {
          planName: "Pro Plan",
          isTrial: false,
          daysRemaining: null,
          weeksRemaining: null,
          renewsAt: "2026-08-01",
          isPastDue: false,
        },
        paymentMethodLast4: "4242",
        invoices: [
          { id: "inv-001", date: "2026-07-01", amount: 499, status: "PAID", pdfUrl: "#" },
          { id: "inv-002", date: "2026-06-01", amount: 499, status: "PAID", pdfUrl: "#" },
        ]
      };
      
      return details;
    }
  });
}
