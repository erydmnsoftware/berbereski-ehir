import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json({ error: 'Eksik parametreler (to, message)' }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json({ error: 'Twilio ayarları eksik' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    return NextResponse.json({ success: true, messageId: response.sid });
  } catch (error: any) {
    console.error('SMS Gönderme Hatası:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
