import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get('barberId');
    const serviceId = searchParams.get('serviceId');
    const dateStr = searchParams.get('date'); // YYYY-MM-DD

    if (!barberId || !serviceId || !dateStr) {
      return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
    }

    // 1. Get Service duration
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('duration_minutes')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 400 });
    }
    const duration = service.duration_minutes;

    // 2. Get Barber working hours
    const { data: barber, error: barberError } = await supabase
      .from('barbers')
      .select('working_hours')
      .eq('id', barberId)
      .single();

    if (barberError || !barber) {
      return NextResponse.json({ error: "Berber bulunamadı" }, { status: 400 });
    }

    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday
    const daysMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayKey = daysMap[dayOfWeek];

    // Default hours if nothing is set in DB yet
    const workingHours = barber.working_hours || {
      mon: ["09:00", "20:00"], tue: ["09:00", "20:00"],
      wed: ["09:00", "20:00"], thu: ["09:00", "20:00"],
      fri: ["09:00", "20:00"], sat: ["09:00", "20:00"],
      sun: null
    };

    const todayHours = workingHours[dayKey];

    // Check if the barber is off on this day (todayHours is null or invalid)
    if (!todayHours || todayHours.length !== 2) {
      return NextResponse.json({ slots: [], workingHours: null });
    }

    const [openTimeStr, closeTimeStr] = todayHours;
    const [openHour, openMin] = openTimeStr.split(":").map(Number);
    const [closeHour, closeMin] = closeTimeStr.split(":").map(Number);

    // 3. Get existing appointments for the barber on that date
    const startOfDay = new Date(`${dateStr}T00:00:00+03:00`).toISOString();
    const endOfDay = new Date(`${dateStr}T23:59:59+03:00`).toISOString();

    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('start_time, end_time, status')
      .eq('barber_id', barberId)
      .neq('status', 'cancelled')
      .gte('start_time', startOfDay)
      .lte('start_time', endOfDay);

    if (apptError) throw apptError;

    // 4. Generate Slots
    const slots = [];
    const now = new Date();
    
    const cursor = new Date(`${dateStr}T00:00:00+03:00`);
    cursor.setHours(openHour, openMin, 0, 0);
    
    const closingTime = new Date(`${dateStr}T00:00:00+03:00`);
    closingTime.setHours(closeHour, closeMin, 0, 0);

    while (cursor < closingTime) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor.getTime() + duration * 60000);
      
      const timeString = `${slotStart.getHours().toString().padStart(2, '0')}:${slotStart.getMinutes().toString().padStart(2, '0')}`;
      
      let available = true;
      let reason = undefined;

      // Check if slot is in the past
      if (slotStart < now) {
        available = false;
        reason = 'past';
      }
      
      // Check if it exceeds closing time
      if (available && slotEnd > closingTime) {
        available = false;
        reason = 'closing_time';
      }

      // Check collision with existing appointments
      if (available && appointments) {
        for (const appt of appointments) {
          const apptStart = new Date(appt.start_time);
          const apptEnd = new Date(appt.end_time);
          
          // Collision logic: (slotStart < apptEnd) && (slotEnd > apptStart)
          if (slotStart < apptEnd && slotEnd > apptStart) {
            available = false;
            reason = 'booked';
            break;
          }
        }
      }

      slots.push({
        time: timeString,
        available,
        reason
      });

      // Increment cursor by 30 mins (typical slot gap)
      cursor.setTime(cursor.getTime() + 30 * 60000);
    }

    return NextResponse.json({
      slots,
      workingHours: { open: "09:00", close: "19:00" }
    });

  } catch (error) {
    console.error("API Error (slots):", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
