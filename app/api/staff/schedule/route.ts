import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { addDays, format, getDaysInMonth, startOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { DayShiftStatus } from '@/lib/api/types/staff-schedule';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');
    const year = parseInt(searchParams.get('year') || '2026', 10);
    const groupBy = searchParams.get('groupBy') || 'MONTH'; // MONTH or WEEK

    if (!staffId) {
      return NextResponse.json({ error: 'staffId required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Get barber info and shop hours
    const { data: barber, error: barberError } = await supabase
      .from('barbers')
      .select('name, working_hours, salons(name, working_hours)')
      .eq('id', staffId)
      .single();

    if (barberError || !barber) {
      return NextResponse.json({ error: 'Berber bulunamadı' }, { status: 404 });
    }

    // 2. Get appointments for this year to calculate bookedHours
    // In a real pro app, we'd do a complex aggregate query. Here we will fetch them and process in memory for the year.
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const { data: appointments } = await supabase
      .from('appointments')
      .select('start_time, end_time, status')
      .eq('barber_id', staffId)
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .not('status', 'eq', 'cancelled');

    // Group appointments by date
    const appointmentsByDate: Record<string, number> = {};
    if (appointments) {
      appointments.forEach((apt: any) => {
        const d = format(new Date(apt.start_time), 'yyyy-MM-dd');
        const duration = (new Date(apt.end_time).getTime() - new Date(apt.start_time).getTime()) / (1000 * 60 * 60);
        appointmentsByDate[d] = (appointmentsByDate[d] || 0) + duration;
      });
    }

    // Determine weekly schedule rules
    const shopHours = (barber.salons as any)?.working_hours || {};
    const barberHours = barber.working_hours || shopHours;

    // Fetch shift overrides
    const { data: shiftOverrides } = await supabase
      .from('barber_shifts')
      .select('shift_date, start_time, end_time, is_day_off')
      .eq('barber_id', staffId)
      .gte('shift_date', startDate)
      .lte('shift_date', endDate);

    const shiftOverridesMap: Record<string, any> = {};
    if (shiftOverrides) {
      shiftOverrides.forEach((so: any) => {
        shiftOverridesMap[so.shift_date] = so;
      });
    }

    const periods = [];

    if (groupBy === 'MONTH') {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        const daysInMonth = getDaysInMonth(date);
        const days = [];
        let scheduledHours = 0;
        let bookedHours = 0;
        let dayBlockedCount = 0;

        for (let d = 1; d <= daysInMonth; d++) {
          const currentDay = new Date(year, month, d);
          const dateStr = format(currentDay, 'yyyy-MM-dd');
          const dayOfWeekStr = format(currentDay, 'E').toLowerCase(); // mon, tue, etc.

          let status: DayShiftStatus = "SCHEDULED";
          let shiftStart = null;
          let shiftEnd = null;
          let shifts: any[] = [];
          let hrs = 0;

          const override = shiftOverridesMap[dateStr];
          if (override) {
            if (override.is_day_off) {
              status = "CLOSED";
            } else {
              shiftStart = override.start_time.substring(0, 5); // "HH:MM"
              shiftEnd = override.end_time.substring(0, 5);
              shifts = [{ start: shiftStart, end: shiftEnd }];
              const sH = parseInt(shiftStart.split(':')[0], 10);
              const eH = parseInt(shiftEnd.split(':')[0], 10);
              hrs = Math.max(0, eH - sH);
            }
          } else {
            const dayRules = barberHours[dayOfWeekStr] || { closed: true };
            if (dayRules.closed) {
              status = "CLOSED";
            } else {
              shiftStart = dayRules.open || "09:00";
              shiftEnd = dayRules.close || "19:00";
              shifts = [{ start: shiftStart, end: shiftEnd }];
              const sH = parseInt(shiftStart.split(':')[0], 10);
              const eH = parseInt(shiftEnd.split(':')[0], 10);
              hrs = Math.max(0, eH - sH);
            }
          }

          const bHrs = appointmentsByDate[dateStr] || 0;
          scheduledHours += hrs;
          bookedHours += bHrs;

          days.push({
            date: dateStr,
            dayLabel: format(currentDay, 'E d MMM', { locale: tr }),
            status,
            shiftStart,
            shiftEnd,
            shifts,
            scheduledHours: hrs,
            bookedHours: bHrs,
            workedHours: hrs // Using scheduled as worked for future
          });
        }

        periods.push({
          periodKey: format(date, 'yyyy-MM'),
          periodLabel: format(date, 'MMMM yyyy', { locale: tr }),
          dayBlockedCount,
          scheduledHours,
          bookedHours,
          workedHours: scheduledHours,
          days
        });
      }
    } else {
      // WEEK mode
      let currentWeekStart = startOfWeek(new Date(year, 0, 1), { weekStartsOn: 1 });
      for (let w = 0; w < 52; w++) {
        const days = [];
        let scheduledHours = 0;
        let bookedHours = 0;
        let dayBlockedCount = 0;

        for (let d = 0; d < 7; d++) {
          const currentDay = addDays(currentWeekStart, d);
          const dateStr = format(currentDay, 'yyyy-MM-dd');
          const dayOfWeekStr = format(currentDay, 'E').toLowerCase(); 

          let status: DayShiftStatus = "SCHEDULED";
          let shiftStart = null;
          let shiftEnd = null;
          let shifts: any[] = [];
          let hrs = 0;

          const override = shiftOverridesMap[dateStr];
          if (override) {
            if (override.is_day_off) {
              status = "CLOSED";
            } else {
              shiftStart = override.start_time.substring(0, 5); 
              shiftEnd = override.end_time.substring(0, 5);
              shifts = [{ start: shiftStart, end: shiftEnd }];
              const sH = parseInt(shiftStart.split(':')[0], 10);
              const eH = parseInt(shiftEnd.split(':')[0], 10);
              hrs = Math.max(0, eH - sH);
            }
          } else {
            const dayRules = barberHours[dayOfWeekStr] || { closed: true };
            if (dayRules.closed) {
              status = "CLOSED";
            } else {
              shiftStart = dayRules.open || "09:00";
              shiftEnd = dayRules.close || "19:00";
              shifts = [{ start: shiftStart, end: shiftEnd }];
              const sH = parseInt(shiftStart.split(':')[0], 10);
              const eH = parseInt(shiftEnd.split(':')[0], 10);
              hrs = Math.max(0, eH - sH);
            }
          }

          const bHrs = appointmentsByDate[dateStr] || 0;
          scheduledHours += hrs;
          bookedHours += bHrs;

          days.push({
            date: dateStr,
            dayLabel: format(currentDay, 'E d MMM', { locale: tr }),
            status,
            shiftStart,
            shiftEnd,
            shifts,
            scheduledHours: hrs,
            bookedHours: bHrs,
            workedHours: hrs 
          });
        }

        periods.push({
          periodKey: format(currentWeekStart, "yyyy-MM-dd"),
          periodLabel: format(currentWeekStart, "dd/MM/yy"),
          dayBlockedCount,
          scheduledHours,
          bookedHours,
          workedHours: scheduledHours,
          days
        });

        currentWeekStart = addDays(currentWeekStart, 7);
      }
    }

    return NextResponse.json({
      staffId,
      staffName: barber.name,
      shopName: (barber.salons as any)?.name || "Bilinmiyor",
      year,
      groupBy,
      weekStartDay: groupBy === "WEEK" ? "MON" : null,
      monthStartDayOfMonth: groupBy === "MONTH" ? 1 : null,
      periods
    });

  } catch (err: any) {
    console.error("GET /api/staff/schedule Error:", err);
    return NextResponse.json({ error: 'Beklenmeyen hata' }, { status: 500 });
  }
}
