import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_PHONE = Deno.env.get('TWILIO_PHONE')
const NOTIFICATION_CHANNEL = Deno.env.get('NOTIFICATION_CHANNEL') || 'mock'

serve(async (req) => {
  try {
    const { segment } = await req.json()
    console.log(`[send-reminder] Segment için tetiklendi: ${segment}`)

    // Burada veritabanından inactive_customers view'ı sorgulanır
    // Supabase JS client kullanılarak
    
    // Mock işlem: Sadece logla
    if (NOTIFICATION_CHANNEL === 'mock') {
      console.log(`Mock Modu: ${segment} segmentindeki kullanıcılara hatırlatma gönderiliyor (Simüle edildi).`)
    } else {
      console.log(`Gerçek Twilio Entegrasyonu çalıştırılıyor (Segment: ${segment})...`)
      // Twilio API call here
    }

    return new Response(
      JSON.stringify({ success: true, message: "Reminder function executed" }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
})
