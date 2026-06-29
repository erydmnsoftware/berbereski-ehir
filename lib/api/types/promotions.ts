import { z } from "zod";

export const PromotionTypeEnum = z.enum(["DISCOUNT", "REWARD"]);
export const PromotionTargetEnum = z.enum(["BOOKINGS", "PRODUCTS"]);
export const AmountModeEnum = z.enum(["FIXED", "PERCENTAGE"]);
export const ServiceScopeEnum = z.enum(["ALL", "SINGLE", "MULTIPLE"]);

export const WeeklyWindowSchema = z.object({
  day: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]),
  enabled: z.boolean(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const PromotionSchema = z.object({
  id: z.string(),
  type: PromotionTypeEnum,
  target: PromotionTargetEnum,
  description: z.string().nullable(),

  amountMode: AmountModeEnum,
  amountValue: z.number().positive(),

  firstBookingOnly: z.boolean().default(false),
  perCustomerUsageLimit: z.number().int().positive().nullable(),
  allowMultipleServicesPerBooking: z.boolean().default(true),

  requiresCode: z.boolean(),
  code: z.string().nullable(),

  startDate: z.string().nullable(), // yyyy-MM-dd
  endDate: z.string().nullable(),

  weeklySchedule: z.array(WeeklyWindowSchema).nullable(),

  audienceScope: z.enum(["ALL_CUSTOMERS", "SEGMENT", "SPECIFIC_CUSTOMERS"]).default("ALL_CUSTOMERS"),
  audienceSegmentId: z.string().nullable(), // Maps to LoyaltyTier ID

  serviceScope: ServiceScopeEnum,
  serviceIds: z.array(z.string()).nullable(),

  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Promotion = z.infer<typeof PromotionSchema>;
export type WeeklyWindow = z.infer<typeof WeeklyWindowSchema>;
