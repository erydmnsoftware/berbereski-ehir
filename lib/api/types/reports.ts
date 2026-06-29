import { z } from "zod";

export const ReportRowSchema = z.object({
  groupKey: z.string(),          // "berberesk", "Eray Duman", "Saç Kesimi" vb.
  groupColor: z.string(),        // satır rengi (legend ile eşleşen hex)
  total: z.number(),
  cancelled: z.number().int().nullable(),
  noShow: z.number().int().nullable(),
  customers: z.number().int().nullable(),
  avgTicket: z.number().nullable(),
  hoursSold: z.number().nullable(),
  newSignups: z.number().int().nullable(),
});

export const ReportTableResponseSchema = z.object({
  dimension: z.enum(["SHOP", "BARBER", "SERVICE", "PRODUCT", "BOOKING_TYPE", "CUSTOMERS"]),
  rows: z.array(ReportRowSchema),
  grandTotal: ReportRowSchema,
  dateRange: z.object({ from: z.string().date(), to: z.string().date() }),
});

export const ChartSeriesPointSchema = z.object({
  date: z.string().date(),
  groupKey: z.string(),          // hangi alt-kategoriye ait (örn. "Saç Kesimi")
  value: z.number(),
});

export const ChartDataResponseSchema = z.object({
  metric: z.enum(["VALUE", "BOOKINGS_COUNT", "NEW_CUSTOMERS"]),
  granularity: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  points: z.array(ChartSeriesPointSchema),
  series: z.array(z.object({ groupKey: z.string(), color: z.string() })),
});

export type ReportRow = z.infer<typeof ReportRowSchema>;
export type ReportTableResponse = z.infer<typeof ReportTableResponseSchema>;
export type ChartDataResponse = z.infer<typeof ChartDataResponseSchema>;
export type ChartSeriesPoint = z.infer<typeof ChartSeriesPointSchema>;
