import { z } from "zod";

export const GroupByModeEnum = z.enum(["MONTH", "WEEK"]);

export const DayShiftStatusEnum = z.enum(["CLOSED", "SCHEDULED", "DAY_BLOCKED"]);

export const DayEntrySchema = z.object({
  date: z.string().date(),
  dayLabel: z.string(),              // "Prş 1 Oca"
  status: DayShiftStatusEnum,
  shiftStart: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  shiftEnd: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  shifts: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/),
  })).optional().default([]),
  scheduledHours: z.number(),         
  bookedHours: z.number(),            
  workedHours: z.number(),            
});

export const PeriodSummarySchema = z.object({
  periodKey: z.string(),              // "2026-01" ya da "2026-01-01"
  periodLabel: z.string(),            // "Ocak 2026" / "01/01/26"
  dayBlockedCount: z.number().int(),  
  scheduledHours: z.number(),
  bookedHours: z.number(),
  workedHours: z.number(),
  days: z.array(DayEntrySchema),      
});

export const StaffScheduleReportSchema = z.object({
  staffId: z.string(),
  staffName: z.string(),
  shopName: z.string(),               
  year: z.number().int(),
  groupBy: GroupByModeEnum,
  weekStartDay: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]).nullable(),
  monthStartDayOfMonth: z.number().int().min(1).max(31).nullable(), 
  periods: z.array(PeriodSummarySchema),
});

export const MultiStaffScheduleReportSchema = z.object({
  year: z.number().int(),
  groupBy: GroupByModeEnum,
  staffReports: z.array(StaffScheduleReportSchema),
});

export type GroupByMode = z.infer<typeof GroupByModeEnum>;
export type DayShiftStatus = z.infer<typeof DayShiftStatusEnum>;
export type DayEntry = z.infer<typeof DayEntrySchema>;
export type PeriodSummary = z.infer<typeof PeriodSummarySchema>;
export type StaffScheduleReport = z.infer<typeof StaffScheduleReportSchema>;
export type MultiStaffScheduleReport = z.infer<typeof MultiStaffScheduleReportSchema>;
