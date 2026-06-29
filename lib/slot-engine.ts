import { createServerClient } from './supabase';

interface SlotEngineInput {
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
}

interface TimeSlot {
  time: string; // "10:00"
  available: boolean;
  reason?: string;
}

export async function getAvailableSlots({ barberId, serviceId, date }: SlotEngineInput): Promise<TimeSlot[]> {
  const supabase = createServerClient();
  const selectedDate = new Date(date);
  
  // 1. Barber and Service Info
  const [barberRes, serviceRes] = await Promise.all([
    supabase.from('barbers').select('working_hours, salon_id').eq('id', barberId).single(),
    supabase.from('services').select('duration_minutes').eq('id', serviceId).single()
  ]);

  if (!barberRes.data || !serviceRes.data) throw new Error('Berber veya hizmet bulunamadı');
  
  const duration = serviceRes.data.duration_minutes;
  const salonId = barberRes.data.salon_id;

  // 2. Salon Working Hours (Fallback if barber has no specific hours)
  let workingHours = barberRes.data.working_hours;
  if (!workingHours) {
    const salonRes = await supabase.from('salons').select('working_hours, slot_duration_minutes').eq('id', salonId).single();
    workingHours = salonRes.data?.working_hours;
  }

  // Determine day of week for working hours (mon, tue, wed...)
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayName = days[selectedDate.getDay()];
  const daySchedule = workingHours?.[dayName];

  if (!daySchedule || daySchedule.closed) {
    return []; // Kapalı
  }

  // 3. Get Appointments and Breaks for that day
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const [appointmentsRes, breaksRes] = await Promise.all([
    supabase.from('appointments')
      .select('start_time, end_time, actual_end_time, status')
      .eq('barber_id', barberId)
      .neq('status', 'cancelled')
      .neq('status', 'no_show')
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString()),
    
    supabase.from('barber_breaks')
      .select('start_time, end_time')
      .eq('barber_id', barberId)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
  ]);

  const appointments = appointmentsRes.data || [];
  const breaks = breaksRes.data || [];

  // 4. Generate Slots
  const slots: TimeSlot[] = [];
  const [openHour, openMin] = daySchedule.open.split(':').map(Number);
  const [closeHour, closeMin] = daySchedule.close.split(':').map(Number);
  
  const currentSlotTime = new Date(selectedDate);
  currentSlotTime.setHours(openHour, openMin, 0, 0);

  const closingTime = new Date(selectedDate);
  closingTime.setHours(closeHour, closeMin, 0, 0);

  const slotIntervalMinutes = 15; // 15 dk aralıklarla slot üret

  while (currentSlotTime < closingTime) {
    const slotStart = new Date(currentSlotTime);
    const slotEnd = new Date(currentSlotTime.getTime() + duration * 60000);

    // Eğer slot kapanış saatini aşıyorsa üretme
    if (slotEnd > closingTime) {
      break;
    }

    const timeString = `${slotStart.getHours().toString().padStart(2, '0')}:${slotStart.getMinutes().toString().padStart(2, '0')}`;
    let isAvailable = true;
    let conflictReason = '';

    // Geçmiş zaman kontrolü (Bugünse)
    if (slotStart < new Date()) {
      isAvailable = false;
      conflictReason = 'Geçmiş zaman';
    }

    // Randevu çakışma kontrolü
    if (isAvailable) {
      for (const app of appointments) {
        const appStart = new Date(app.start_time);
        // Eğer erken bitmişse actual_end_time kullan
        const appEnd = app.actual_end_time ? new Date(app.actual_end_time) : new Date(app.end_time);

        if (slotStart < appEnd && slotEnd > appStart) {
          isAvailable = false;
          conflictReason = 'Dolu';
          break;
        }
      }
    }

    // Mola çakışma kontrolü
    if (isAvailable) {
      for (const b of breaks) {
        const breakStart = new Date(b.start_time);
        const breakEnd = new Date(b.end_time);

        if (slotStart < breakEnd && slotEnd > breakStart) {
          isAvailable = false;
          conflictReason = 'Mola';
          break;
        }
      }
    }

    if (isAvailable) {
      slots.push({ time: timeString, available: true });
    }

    // 15 dk ileri sar
    currentSlotTime.setTime(currentSlotTime.getTime() + slotIntervalMinutes * 60000);
  }

  return slots;
}
