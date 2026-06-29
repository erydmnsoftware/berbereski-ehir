import { Resend } from 'resend';
import twilio from 'twilio';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

let twilioClient: twilio.Twilio | null = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn("Resend API Key is missing. Email not sent:", subject);
    return;
  }
  
  try {
    const data = await resend.emails.send({
      from: 'BerberEskişehir VIP <randevu@berbereskisehir.com>', // Note: the domain must be verified on Resend, else use a default testing domain like onboarding@resend.dev
      to: [to],
      subject: subject,
      html: html,
    });
    return data;
  } catch (error) {
    console.error("Resend Email Error:", error);
    throw error;
  }
}

export async function sendSMS({
  to,
  body
}: {
  to: string;
  body: string;
}) {
  if (!twilioClient) {
    console.warn("Twilio credentials missing. SMS not sent:", body);
    return;
  }

  try {
    // Format to: ensure it starts with +90 if local format
    let formattedTo = to.replace(/\s+/g, "");
    if (!formattedTo.startsWith("+")) {
      if (formattedTo.startsWith("0")) {
        formattedTo = "+90" + formattedTo.slice(1);
      } else {
        formattedTo = "+90" + formattedTo;
      }
    }

    const message = await twilioClient.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedTo,
    });
    return message;
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    throw error;
  }
}
