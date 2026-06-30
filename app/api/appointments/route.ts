import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSMS, sendEmail } from '@/lib/notifications';

// Create a server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, date, time, barberId, serviceId, notes } = body;

    if (!name || !phone || !date || !time || !barberId || !serviceId) {
      return NextResponse.json({ error: "Eksik bilgi girdiniz" }, { status: 400 });
    }

    // 1. Get Service Details to get the price & duration
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('name, price, duration_minutes')
      .eq('id', serviceId)
      .single();

    if (serviceError || !serviceData) {
      return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 400 });
    }

    // 2. Check if customer exists by phone
    let customer_id;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingCustomer) {
      customer_id = existingCustomer.id;
    } else {
      // Create new customer
      const { data: newCustomer, error: newCustomerError } = await supabase
        .from('customers')
        .insert({
          name,
          phone,
          email: email || null,
          notes: notes || null
        })
        .select()
        .single();
        
      if (newCustomerError || !newCustomer) {
        console.error("Customer Creation Error:", newCustomerError);
        return NextResponse.json({ error: "Müşteri oluşturulamadı" }, { status: 500 });
      }
      customer_id = newCustomer.id;
    }

    // 3. Calculate start_time and end_time
    const start_time = new Date(`${date}T${time}:00+03:00`); 
    const end_time = new Date(start_time.getTime() + serviceData.duration_minutes * 60000);

    // 4. Create Appointment
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        customer_id,
        barber_id: barberId,
        service_id: serviceId,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
        price: serviceData.price,
        notes: notes || null,
        status: 'pending'
      })
      .select()
      .single();

    if (appointmentError || !appointmentData) {
      console.error("Appointment Error:", appointmentError);
      return NextResponse.json({ error: "Randevu oluşturulamadı" }, { status: 500 });
    }

    // 5. Send Notifications
    // SMS to Customer
    try {
      const smsBody = `Sayın ${name}, ${date} saat ${time} için BerberOS randevunuz başarıyla alınmıştır. İyi günler dileriz.`;
      await sendSMS({ to: phone, body: smsBody });
    } catch (e) {
      console.error("SMS Warning:", e);
    }

    // Email to Customer (if provided)
    if (email) {
      try {
        const emailHtml = `
          <h3>BerberOS - Randevu Onayı</h3>
          <p>Sayın ${name}, randevunuz başarıyla oluşturuldu.</p>
          <p><strong>Tarih & Saat:</strong> ${date} ${time}</p>
          <p><strong>Hizmet:</strong> ${serviceData.name}</p>
          <p><strong>Tutar:</strong> ₺${serviceData.price}</p>
        `;
        await sendEmail({
          to: email,
          subject: 'BerberOS - Randevu Onayı',
          html: emailHtml
        });
      } catch (e) {
        console.error("Email Warning:", e);
      }
    }

    return NextResponse.json({ success: true, appointment: appointmentData });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
