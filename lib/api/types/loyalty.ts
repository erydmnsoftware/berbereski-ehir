import { z } from "zod";

export const LoyaltyTierSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number().int(),
  minPointsThreshold: z.number().int().min(0),
  color: z.string(),
  icon: z.enum(["bronze", "silver", "gold", "diamond", "star", "crown"]),
  perks: z.array(z.object({
    type: z.enum(["AUTO_DISCOUNT_PERCENT", "PRIORITY_BOOKING", "FREE_SERVICE_EVERY_N", "BIRTHDAY_GIFT"]),
    value: z.number().nullable(),
    label: z.string(),
  })),
});

export const PointsRuleSchema = z.object({
  isEnabled: z.boolean(),
  pointsPerCurrencyUnit: z.number().positive(),
  pointsExpireAfterMonths: z.number().int().nullable(),
  roundingMode: z.enum(["FLOOR", "ROUND", "CEIL"]),
});

export const LoyaltyMemberSchema = z.object({
  customerId: z.string(),
  customerName: z.string(),
  currentPoints: z.number().int(),
  lifetimePoints: z.number().int(),
  currentTierId: z.string(),
  memberSince: z.string().datetime(),
  cardCode: z.string(),
});

export const PointsLedgerEntrySchema = z.object({
  id: z.string(),
  customerId: z.string(),
  type: z.enum(["EARN", "REDEEM", "MANUAL_ADJUST", "EXPIRE"]),
  points: z.number(),
  relatedBookingId: z.string().nullable(),
  note: z.string().nullable(),
  performedBy: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type LoyaltyTier = z.infer<typeof LoyaltyTierSchema>;
export type PointsRule = z.infer<typeof PointsRuleSchema>;
export type LoyaltyMember = z.infer<typeof LoyaltyMemberSchema>;
export type PointsLedgerEntry = z.infer<typeof PointsLedgerEntrySchema>;
