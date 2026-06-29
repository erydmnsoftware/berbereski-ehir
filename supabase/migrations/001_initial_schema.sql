-- =============================================
-- BerberEskişehir VIP System - Initial Schema
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- =============================================
-- SALONS (Salon Ayarları)
-- =============================================
CREATE TABLE IF NOT EXISTS salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT DEFAULT 'Eskişehir',
  instagram TEXT,
  facebook TEXT,
  working_hours JSONB DEFAULT '{
    "mon": {"open": "09:00", "close": "19:00", "closed": false},
    "tue": {"open": "09:00", "close": "19:00", "closed": false},
    "wed": {"open": "09:00", "close": "19:00", "closed": false},
    "thu": {"open": "09:00", "close": "19:00", "closed": false},
    "fri": {"open": "09:00", "close": "19:00", "closed": false},
    "sat": {"open": "09:00", "close": "17:00", "closed": false},
    "sun": {"open": "10:00", "close": "15:00", "closed": true}
  }',
  slot_duration_minutes INT DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- BARBERS (Çalışanlar)
-- =============================================
CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT DEFAULT 'Berber',
  bio TEXT,
  photo_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  working_hours JSONB,  -- NULL = salon saatlerini kullan
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- SERVICES (Hizmetler)
-- =============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'haircut',  -- haircut | beard | skincare | vip | combo
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- CUSTOMERS (Müşteriler)
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  total_visits INT DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_visit_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',  -- ['vip', 'duzenli', 'yeni']
  is_blacklisted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(salon_id, phone)
);

-- =============================================
-- APPOINTMENTS (Randevular)
-- =============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  -- pending | confirmed | in_progress | completed | cancelled | no_show
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  actual_end_time TIMESTAMPTZ,  -- Gerçek bitiş zamanı (slot motoru için kritik)
  price DECIMAL(10,2),
  notes TEXT,
  source TEXT DEFAULT 'online',  -- online | phone | walk_in | admin
  reminder_sent BOOLEAN DEFAULT false,
  confirmation_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- WAITLIST (Bekleme Listesi)
-- =============================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  preferred_barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
  preferred_date DATE,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- BARBER BREAKS (Berber Molaları)
-- =============================================
CREATE TABLE IF NOT EXISTS barber_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT DEFAULT 'Mola',
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT  -- RRULE formatı
);

-- =============================================
-- NOTIFICATION LOGS (Bildirim Logları)
-- =============================================
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,  -- sms | whatsapp | mock
  message TEXT,
  status TEXT DEFAULT 'pending',  -- sent | failed | mock
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- VIEWS (Otomatik Segmentler)
-- =============================================

-- 30 gün gelmeyen müşteriler
CREATE OR REPLACE VIEW inactive_customers AS
SELECT c.*, s.name as salon_name
FROM customers c
JOIN salons s ON c.salon_id = s.id
WHERE c.last_visit_at < NOW() - INTERVAL '30 days'
  AND c.total_visits > 0
  AND c.is_blacklisted = false;

-- VIP müşteriler (10+ ziyaret VEYA vip tag)
CREATE OR REPLACE VIEW vip_customers AS
SELECT c.*, s.name as salon_name
FROM customers c
JOIN salons s ON c.salon_id = s.id
WHERE (c.total_visits >= 10 OR 'vip' = ANY(c.tags))
  AND c.is_blacklisted = false;

-- Yeni müşteriler (son 7 gün)
CREATE OR REPLACE VIEW new_customers AS
SELECT c.*, s.name as salon_name
FROM customers c
JOIN salons s ON c.salon_id = s.id
WHERE c.created_at > NOW() - INTERVAL '7 days';

-- Bugünün randevuları (özet)
CREATE OR REPLACE VIEW todays_appointments AS
SELECT 
  a.*,
  c.name as customer_name,
  c.phone as customer_phone,
  b.name as barber_name,
  sv.name as service_name,
  sv.duration_minutes,
  sv.category as service_category
FROM appointments a
LEFT JOIN customers c ON a.customer_id = c.id
LEFT JOIN barbers b ON a.barber_id = b.id
LEFT JOIN services sv ON a.service_id = sv.id
WHERE DATE(a.start_time AT TIME ZONE 'Europe/Istanbul') = CURRENT_DATE
ORDER BY a.start_time;

-- =============================================
-- INDEXES (Performans)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_appointments_barber_date ON appointments(barber_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_salon_date ON appointments(salon_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_salon ON customers(salon_id);

-- =============================================
-- TRIGGERS (Otomatik Güncellemeler)
-- =============================================

-- updated_at otomatik güncelle
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_salons_updated_at BEFORE UPDATE ON salons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_barbers_updated_at BEFORE UPDATE ON barbers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Randevu tamamlandığında müşteri istatistiklerini güncelle
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE customers
    SET 
      total_visits = total_visits + 1,
      total_spent = total_spent + COALESCE(NEW.price, 0),
      last_visit_at = NEW.actual_end_time OR NEW.end_time
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_completed_trigger
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- =============================================
-- SEED DATA (Demo Verisi)
-- =============================================

-- Salon
INSERT INTO salons (id, name, phone, email, address, city, instagram) VALUES
  ('11111111-1111-1111-1111-111111111111', 'BerberEskişehir VIP', '+90 222 000 0000', 'info@berbereskisehir.com', 'Odunpazarı, Eskişehir', 'Eskişehir', '@berbereskisehirvip')
ON CONFLICT DO NOTHING;

-- Hizmetler
INSERT INTO services (salon_id, name, description, duration_minutes, price, category, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Saç Kesim', 'Klasik ve modern saç kesim stilleri', 30, 250, 'haircut', 1),
  ('11111111-1111-1111-1111-111111111111', 'Sakal Kesim & Düzeltme', 'Profesyonel sakal şekillendirme', 20, 150, 'beard', 2),
  ('11111111-1111-1111-1111-111111111111', 'Cilt Bakım', 'Yüz temizliği ve nem maskesi', 45, 350, 'skincare', 3),
  ('11111111-1111-1111-1111-111111111111', 'VIP Kombo Paket', 'Saç + Sakal + Cilt Bakım + İçecek İkramı', 90, 650, 'vip', 4),
  ('11111111-1111-1111-1111-111111111111', 'Saç Boyama', 'Profesyonel saç rengi uygulaması', 90, 500, 'haircut', 5),
  ('11111111-1111-1111-1111-111111111111', 'Ense Düzeltme', 'Hızlı ense ve kenar düzeltme', 15, 100, 'haircut', 6)
ON CONFLICT DO NOTHING;

-- Berberler
INSERT INTO barbers (salon_id, name, title, bio, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mehmet Usta', 'Baş Berber', '15 yıllık deneyimiyle modern ve klasik stillerin ustası.', 1),
  ('11111111-1111-1111-1111-111111111111', 'Ali Kaya', 'VIP Uzmanı', 'VIP hizmetleri ve cilt bakımı konusunda uzman.', 2),
  ('11111111-1111-1111-1111-111111111111', 'Can Demir', 'Sakal Ustası', 'Sakal şekillendirme ve bakımının ismi.', 3)
ON CONFLICT DO NOTHING;
