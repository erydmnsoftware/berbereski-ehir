-- =============================================
-- BerberEskişehir VIP System — Supabase Kurulum SQL
-- Bu dosyayı Supabase Dashboard > SQL Editor'de çalıştırın
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- pg_cron ve pg_net extensions'ı Supabase Dashboard > Database > Extensions'tan etkinleştirin

-- =============================================
-- TABLOLAR
-- =============================================

-- SALONS
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

-- BARBERS
CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT DEFAULT 'Berber',
  bio TEXT,
  photo_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  working_hours JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'haircut',
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CUSTOMERS
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
  tags TEXT[] DEFAULT '{}',
  is_blacklisted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(salon_id, phone)
);

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  actual_end_time TIMESTAMPTZ,
  price DECIMAL(10,2),
  notes TEXT,
  source TEXT DEFAULT 'online',
  reminder_sent BOOLEAN DEFAULT false,
  confirmation_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- WAITLIST
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

-- BARBER BREAKS
CREATE TABLE IF NOT EXISTS barber_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT DEFAULT 'Mola',
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT
);

-- NOTIFICATION LOGS
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- VIEWS (Otomatik Segmentler)
-- =============================================

CREATE OR REPLACE VIEW inactive_customers AS
SELECT c.*, s.name as salon_name
FROM customers c
JOIN salons s ON c.salon_id = s.id
WHERE c.last_visit_at < NOW() - INTERVAL '30 days'
  AND c.total_visits > 0
  AND c.is_blacklisted = false;

CREATE OR REPLACE VIEW vip_customers AS
SELECT c.*, s.name as salon_name
FROM customers c
JOIN salons s ON c.salon_id = s.id
WHERE (c.total_visits >= 10 OR 'vip' = ANY(c.tags))
  AND c.is_blacklisted = false;

CREATE OR REPLACE VIEW new_customers AS
SELECT c.*, s.name as salon_name
FROM customers c
JOIN salons s ON c.salon_id = s.id
WHERE c.created_at > NOW() - INTERVAL '7 days';

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
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_appointments_barber_date ON appointments(barber_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_salon_date ON appointments(salon_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_salon ON customers(salon_id);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_salons_updated_at ON salons;
CREATE TRIGGER update_salons_updated_at BEFORE UPDATE ON salons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_barbers_updated_at ON barbers;
CREATE TRIGGER update_barbers_updated_at BEFORE UPDATE ON barbers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
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
      last_visit_at = COALESCE(NEW.actual_end_time, NEW.end_time)
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS appointment_completed_trigger ON appointments;
CREATE TRIGGER appointment_completed_trigger
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view salons" ON salons FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view active barbers" ON barbers FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can view active services" ON services FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can view pending appointments" ON appointments FOR SELECT TO anon USING (true);
CREATE POLICY "Public can create online appointments" ON appointments FOR INSERT TO anon WITH CHECK (source = 'online');
CREATE POLICY "Public can create customers" ON customers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can view customers" ON customers FOR SELECT TO anon USING (true);
CREATE POLICY "Public can join waitlist" ON waitlist FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can view barber breaks" ON barber_breaks FOR SELECT TO anon USING (true);

-- =============================================
-- SEED DATA (Demo Verisi)
-- =============================================

INSERT INTO salons (id, name, phone, email, address, city, instagram) VALUES
  ('11111111-1111-1111-1111-111111111111', 'BerberEskişehir VIP', '+90 222 000 0000', 'info@berbereskisehir.com', 'Odunpazarı, Eskişehir', 'Eskişehir', '@berbereskisehirvip')
ON CONFLICT DO NOTHING;

INSERT INTO services (salon_id, name, description, duration_minutes, price, category, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Saç Kesim', 'Klasik ve modern saç kesim stilleri', 30, 250, 'haircut', 1),
  ('11111111-1111-1111-1111-111111111111', 'Sakal Kesim & Düzeltme', 'Profesyonel sakal şekillendirme', 20, 150, 'beard', 2),
  ('11111111-1111-1111-1111-111111111111', 'Cilt Bakım', 'Yüz temizliği ve nem maskesi', 45, 350, 'skincare', 3),
  ('11111111-1111-1111-1111-111111111111', 'VIP Kombo Paket', 'Saç + Sakal + Cilt Bakım + İçecek İkramı', 90, 650, 'vip', 4),
  ('11111111-1111-1111-1111-111111111111', 'Saç Boyama', 'Profesyonel saç rengi uygulaması', 90, 500, 'haircut', 5),
  ('11111111-1111-1111-1111-111111111111', 'Ense Düzeltme', 'Hızlı ense ve kenar düzeltme', 15, 100, 'haircut', 6)
ON CONFLICT DO NOTHING;

INSERT INTO barbers (salon_id, name, title, bio, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mehmet Usta', 'Baş Berber', '15 yıllık deneyimiyle modern ve klasik stillerin ustası.', 1),
  ('11111111-1111-1111-1111-111111111111', 'Ali Kaya', 'VIP Uzmanı', 'VIP hizmetleri ve cilt bakımı konusunda uzman.', 2),
  ('11111111-1111-1111-1111-111111111111', 'Can Demir', 'Sakal Ustası', 'Sakal şekillendirme ve bakımının ismi.', 3)
ON CONFLICT DO NOTHING;

-- Demo müşteriler
INSERT INTO customers (salon_id, name, phone, total_visits, total_spent, last_visit_at, tags) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ahmet Yılmaz', '05551112233', 12, 3100, NOW() - INTERVAL '3 days', ARRAY['vip']),
  ('11111111-1111-1111-1111-111111111111', 'Burak Keskin', '05324445566', 3, 750, NOW() - INTERVAL '45 days', ARRAY[]::TEXT[]),
  ('11111111-1111-1111-1111-111111111111', 'Cem Öztürk', '05447778899', 1, 250, NOW() - INTERVAL '2 days', ARRAY['yeni']),
  ('11111111-1111-1111-1111-111111111111', 'Deniz Kaya', '05332221100', 5, 1250, NOW() - INTERVAL '5 days', ARRAY['duzenli']),
  ('11111111-1111-1111-1111-111111111111', 'Emre Aksoy', '05439876543', 8, 2000, NOW() - INTERVAL '10 days', ARRAY['duzenli']),
  ('11111111-1111-1111-1111-111111111111', 'Fatih Demir', '05361234567', 15, 4250, NOW() - INTERVAL '1 day', ARRAY['vip'])
ON CONFLICT (salon_id, phone) DO NOTHING;
