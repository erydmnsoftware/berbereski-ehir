-- =============================================
-- BerberOS System - Edge Functions / Cron
-- =============================================

-- 1. 30 Gün Gelmeyenlere Hatırlatma (Cron Job)
-- Not: pg_net extension gerekir. Edge function'a HTTP POST isteği atar.

-- Fonksiyonu oluştur
CREATE OR REPLACE FUNCTION trigger_inactive_customers_reminder()
RETURNS void AS $$
DECLARE
  edge_function_url TEXT := current_setting('custom.edge_function_url', true);
  anon_key TEXT := current_setting('custom.anon_key', true);
BEGIN
  -- Eğer Edge function URL set edildiyse tetikle
  IF edge_function_url IS NOT NULL THEN
    PERFORM net.http_post(
      url := edge_function_url || '/send-reminder',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := '{"segment": "inactive"}'::jsonb
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Not: Cron job kurulumu Supabase dashboard'dan veya aşağıdaki komutla yapılabilir
-- Supabase Dashboard SQL Editor'de çalıştırılması önerilir
/*
SELECT cron.schedule(
  'inactive-customer-reminder',
  '0 9 * * *', -- Her gün sabah 9:00
  $$SELECT trigger_inactive_customers_reminder()$$
);
*/

-- =============================================
-- RANDÖVÜ BİLDİRİM TRIGGER
-- =============================================

-- Yeni randevu geldiğinde veya onaylandığında Edge Function'ı tetikle
CREATE OR REPLACE FUNCTION notify_appointment_changes()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT := current_setting('custom.edge_function_url', true);
  anon_key TEXT := current_setting('custom.anon_key', true);
  payload JSONB;
BEGIN
  -- Sadece Edge function URL varsa çalıştır
  IF edge_function_url IS NOT NULL THEN
    payload := jsonb_build_object(
      'appointment_id', NEW.id,
      'status', NEW.status,
      'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE null END,
      'source', NEW.source
    );

    PERFORM net.http_post(
      url := edge_function_url || '/send-confirmation',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := payload
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ı bağla
CREATE TRIGGER appointment_notification_trigger
  AFTER INSERT OR UPDATE OF status
  ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION notify_appointment_changes();
