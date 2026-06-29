import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { notifier } from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { barberId, serviceId, date, time, customerName, customerPhone } = body;

    if (!barberId || !serviceId || !date || !time || !customerName || !customerPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Barber ve Service'i kontrol et
    const [barberRes, serviceRes] = await Promise.all([
      supabase.from('barbers').select('salon_id').eq('id', barberId).single(),
      supabase.from('services').select('duration_minutes, price').eq('id', serviceId).single()
    ]);

    if (!barberRes.data || !serviceRes.data) {
      return NextResponse.json({ error: 'Invalid barber or service' }, { status: 400 });
    }

    const salonId = barberRes.data.salon_id;
    const duration = serviceRes.data.duration_minutes;
    const price = serviceRes.data.price;

    // 2. Müşteri var mı kontrol et, yoksa oluştur
    let customerId;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', customerPhone)
      .eq('salon_id', salonId)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: custError } = await supabase
        .from('customers')
        .insert({
          salon_id: salonId,
          name: customerName,
          phone: customerPhone
        })
        .select('id')
        .single();
        
      if (custError) throw custError;
      customerId = newCustomer.id;
    }

    // 3. Tarih hesapla
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // 4. Randevuyu oluştur (Çakışma kontrolü trigger veya slot engine ile yapıldığı varsayılır)
    const { data: appointment, error: apptError } = await supabase
      .from('appointments')
      .insert({
        salon_id: salonId,
        customer_id: customerId,
        barber_id: barberId,
        service_id: serviceId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        price: price,
        status: 'pending',
        source: 'online'
      })
      .select()
      .single();

    if (apptError) throw apptError;

    // 5. Bildirim gönder (Mock-first)
    await notifier.sendConfirmation(appointment);

    return NextResponse.json({ success: true, appointment });

  } catch (error: any) {
    console.error('Randevu oluşturma hatası:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
