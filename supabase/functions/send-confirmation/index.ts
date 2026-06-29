import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const NOTIFICATION_CHANNEL = Deno.env.get('NOTIFICATION_CHANNEL') || 'mock'

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log(`[send-confirmation] Randevu tetiklendi: ID ${payload.appointment_id}, Yeni Status: ${payload.status}`)

    // Mock işlem: Sadece logla
    if (NOTIFICATION_CHANNEL === 'mock') {
      console.log(`Mock Modu: Randevu ${payload.appointment_id} için ${payload.status} bildirimi simüle edildi.`)
    } else {
      console.log(`Twilio SMS/WhatsApp ile bildirim gönderiliyor...`)
      // Twilio API call here
    }

    return new Response(
      JSON.stringify({ success: true, message: "Confirmation sent" }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
})
