import { z } from "zod";

export const SetupStatusEnum = z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETE"]);

export const SubscriptionStatusSchema = z.object({
  planName: z.string(),                  
  isTrial: z.boolean(),
  daysRemaining: z.number().int().nullable(),  
  weeksRemaining: z.number().int().nullable(), 
  renewsAt: z.string().date().nullable(),
  isPastDue: z.boolean(),                
});

// DIKKAT: Bu şema sadece vitrin (web sitesinde gösterilen) çalışma saatlerini yönetir.
// Gerçek rezervasyon uygunluğunu ETKİLEMEZ.
// Gerçek rezervasyon uygunluğu için Staff Rota (Personel Çalışma Saatleri) sistemi kullanılır.
export const WeeklyHoursEntrySchema = z.object({
  day: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]),
  isOpen: z.boolean(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  breaks: z.array(z.object({
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  })),
});

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  durationMinutes: z.number().int().positive(),
  bufferMinutes: z.number().int().min(0).default(0),  
  customerFacingDurationMinutes: z.number().int().nullable(), 
  price: z.number(),
  showAsStartingPrice: z.boolean(),       
  onlineBookingEnabled: z.boolean(),      
  sortOrder: z.number().int(),            
});

export const BarberSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  bookingIntervalMinutes: z.number().int(), 
  services: z.array(ServiceSchema),
});

export const AddressSchema = z.object({
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  district: z.string().nullable(),        
  postalCode: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const ContactInfoEntrySchema = z.object({
  id: z.string(),
  type: z.enum(["PHONE", "EMAIL", "WEBSITE", "INSTAGRAM", "FACEBOOK", "OTHER_LINK"]),
  value: z.string(),
});

export const ShopSchema = z.object({
  id: z.string(),
  name: z.string(),
  setupStatus: SetupStatusEnum,
  subscription: SubscriptionStatusSchema,
  workingHours: z.array(WeeklyHoursEntrySchema),
  barbers: z.array(BarberSchema),
  address: AddressSchema.nullable(),
  contactInfo: z.array(ContactInfoEntrySchema),
  managerName: z.string().nullable(),     
  weeklyEmailReportEnabled: z.boolean(),
});

export const ShopListResponseSchema = z.object({
  shops: z.array(ShopSchema),
});

export const BillingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceMonthly: z.number(),
  features: z.array(z.string()),
});

export const InvoiceSchema = z.object({
  id: z.string(),
  date: z.string().date(),
  amount: z.number(),
  status: z.enum(["PAID", "PENDING", "FAILED"]),
  pdfUrl: z.string().nullable(),
});

export const BillingDetailsSchema = z.object({
  currentPlan: BillingPlanSchema,
  availablePlans: z.array(BillingPlanSchema),
  subscription: SubscriptionStatusSchema,    
  paymentMethodLast4: z.string().nullable(),
  invoices: z.array(InvoiceSchema),
});

// Tip Çıkarımları
export type SetupStatus = z.infer<typeof SetupStatusEnum>;
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type WeeklyHoursEntry = z.infer<typeof WeeklyHoursEntrySchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Barber = z.infer<typeof BarberSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type ContactInfoEntry = z.infer<typeof ContactInfoEntrySchema>;
export type Shop = z.infer<typeof ShopSchema>;
export type BillingPlan = z.infer<typeof BillingPlanSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type BillingDetails = z.infer<typeof BillingDetailsSchema>;
