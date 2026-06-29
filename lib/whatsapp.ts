// lib/whatsapp.ts

export interface AppointmentNotificationData {
  id: string;
  start_time: string;
  customer_id?: string;
  // Gerekli diğer alanlar...
}

export interface NotificationAdapter {
  sendReminder(appointment: AppointmentNotificationData): Promise<void>;
  sendConfirmation(appointment: AppointmentNotificationData): Promise<void>;
  sendCancellation(appointment: AppointmentNotificationData): Promise<void>;
}

// ---------------------------------------------------------
// 1. Mock Adapter (Geliştirme için bloker olmaması adına)
// ---------------------------------------------------------
class MockAdapter implements NotificationAdapter {
  async sendReminder(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[MOCK NOTIFICATION] 🔔 Hatırlatma Gönderildi: Randevu ID ${appointment.id}`);
    // Gerçekte burada DB'ye log atılır
  }

  async sendConfirmation(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[MOCK NOTIFICATION] ✅ Onay Gönderildi: Randevu ID ${appointment.id}`);
  }

  async sendCancellation(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[MOCK NOTIFICATION] ❌ İptal Gönderildi: Randevu ID ${appointment.id}`);
  }
}

// ---------------------------------------------------------
// 2. Twilio SMS Adapter (Meta onaysız, anında kullanılabilir)
// ---------------------------------------------------------
class TwilioSMSAdapter implements NotificationAdapter {
  async sendReminder(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[TWILIO SMS] Hatırlatma API çağrısı yapılıyor...`);
  }
  
  async sendConfirmation(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[TWILIO SMS] Onay API çağrısı yapılıyor...`);
  }
  
  async sendCancellation(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[TWILIO SMS] İptal API çağrısı yapılıyor...`);
  }
}

// ---------------------------------------------------------
// 3. Twilio WhatsApp Adapter (Meta onaylı)
// ---------------------------------------------------------
class TwilioWhatsAppAdapter implements NotificationAdapter {
  async sendReminder(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[TWILIO WA] Hatırlatma API çağrısı yapılıyor...`);
  }
  
  async sendConfirmation(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[TWILIO WA] Onay API çağrısı yapılıyor...`);
  }
  
  async sendCancellation(appointment: AppointmentNotificationData): Promise<void> {
    console.log(`[TWILIO WA] İptal API çağrısı yapılıyor...`);
  }
}

// ENV'ye göre adapter seçimi
const channel = process.env.NOTIFICATION_CHANNEL || 'mock';

export const notifier: NotificationAdapter = 
  channel === 'whatsapp' ? new TwilioWhatsAppAdapter() :
  channel === 'sms' ? new TwilioSMSAdapter() :
  new MockAdapter();
