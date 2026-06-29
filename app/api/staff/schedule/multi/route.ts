import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { addDays, format, getDaysInMonth, startOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { DayShiftStatus } from '@/lib/api/types/staff-schedule';

export async function POST(req: Request) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const staffIds: string[] = body.staffIds || [];
    const year = body.year || 2026;
    const groupBy = body.groupBy || 'MONTH';

    if (!staffIds.length) {
      return NextResponse.json({ error: 'staffIds required' }, { status: 400 });
    }

    const { data: barbers, error: barberError } = await supabase
      .from('barbers')
      .select('id, name, working_hours, salons(name, working_hours)')
      .in('id', staffIds);

    if (barberError || !barbers) {
      return NextResponse.json({ error: 'Berberler bulunamadı' }, { status: 404 });
    }

    // Process identically as single, but for each barber
    const staffReports = barbers.map((barber: any) => {
      // Very simplified generation for MULTI (so we don't query appointments for each right now)
      // We just map the skeleton
      const shopHours = barber.salons?.working_hours || {};
      const barberHours = barber.working_hours || shopHours;

      const periods = [];

      if (groupBy === 'MONTH') {
        for (let month = 0; month < 12; month++) {
          const date = new Date(year, month, 1);
          const daysInMonth = getDaysInMonth(date);
          const days = [];
          
          let scheduledHours = 0;
          let bookedHours = 0;

          for (let d = 1; d <= daysInMonth; d++) {
            const currentDay = new Date(year, month, d);
            const dateStr = format(currentDay, 'yyyy-MM-dd');
            const dayOfWeekStr = format(currentDay, 'E').toLowerCase();

            let status: DayShiftStatus = "SCHEDULED";
            const dayRules = barberHours[dayOfWeekStr] || { closed: true };
            let hrs = 0;

            if (dayRules.closed) {
              status = "CLOSED";
            } else {
              hrs = 8; // Simplified
            }

            scheduledHours += hrs;

            days.push({
              date: dateStr,
              dayLabel: format(currentDay, 'E d MMM', { locale: tr }),
              status,
              shiftStart: dayRules.closed ? null : (dayRules.open || "09:00"),
              shiftEnd: dayRules.closed ? null : (dayRules.close || "19:00"),
              shifts: dayRules.closed ? [] : [{ start: dayRules.open || "09:00", end: dayRules.close || "19:00" }],
              scheduledHours: hrs,
              bookedHours: 0,
              workedHours: hrs
            });
          }

          periods.push({
            periodKey: format(date, 'yyyy-MM'),
            periodLabel: format(date, 'MMMM yyyy', { locale: tr }),
            dayBlockedCount: 0,
            scheduledHours,
            bookedHours,
            workedHours: scheduledHours,
            days
          });
        }
      } else {
        // WEEK simplified
        let currentWeekStart = startOfWeek(new Date(year, 0, 1), { weekStartsOn: 1 });
        for (let w = 0; w < 52; w++) {
          const days = [];
          let scheduledHours = 0;

          for (let d = 0; d < 7; d++) {
            const currentDay = addDays(currentWeekStart, d);
            const dateStr = format(currentDay, 'yyyy-MM-dd');
            const dayOfWeekStr = format(currentDay, 'E').toLowerCase();

            let status: DayShiftStatus = "SCHEDULED";
            const dayRules = barberHours[dayOfWeekStr] || { closed: true };
            let hrs = 0;

            if (dayRules.closed) {
              status = "CLOSED";
            } else {
              hrs = 8; // Simplified
            }

            scheduledHours += hrs;

            days.push({
              date: dateStr,
              dayLabel: format(currentDay, 'E d MMM', { locale: tr }),
              status,
              shiftStart: dayRules.closed ? null : (dayRules.open || "09:00"),
              shiftEnd: dayRules.closed ? null : (dayRules.close || "19:00"),
              shifts: dayRules.closed ? [] : [{ start: dayRules.open || "09:00", end: dayRules.close || "19:00" }],
              scheduledHours: hrs,
              bookedHours: 0,
              workedHours: hrs
            });
          }

          periods.push({
            periodKey: format(currentWeekStart, "yyyy-MM-dd"),
            periodLabel: format(currentWeekStart, "dd/MM/yy"),
            dayBlockedCount: 0,
            scheduledHours,
            bookedHours: 0,
            workedHours: scheduledHours,
            days
          });
          currentWeekStart = addDays(currentWeekStart, 7);
        }
      }

      return {
        staffId: barber.id,
        staffName: barber.name,
        shopName: barber.salons?.name || "Bilinmiyor",
        year,
        groupBy,
        weekStartDay: groupBy === "WEEK" ? "MON" : null,
        monthStartDayOfMonth: groupBy === "MONTH" ? 1 : null,
        periods
      };
    });

    return NextResponse.json({
      year,
      groupBy,
      staffReports
    });

  } catch (err: any) {
    console.error("POST /api/staff/schedule/multi Error:", err);
    return NextResponse.json({ error: 'Beklenmeyen hata' }, { status: 500 });
  }
}
