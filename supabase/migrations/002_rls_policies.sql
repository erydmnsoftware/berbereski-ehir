-- =============================================
-- BerberOS System - RLS Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC POLICIES (Read-Only)
-- =============================================

-- Herkes aktif salonları okuyabilir
CREATE POLICY "Public can view salons" 
  ON salons FOR SELECT 
  TO public 
  USING (true);

-- Herkes aktif berberleri okuyabilir
CREATE POLICY "Public can view active barbers" 
  ON barbers FOR SELECT 
  TO public 
  USING (is_active = true);

-- Herkes aktif hizmetleri okuyabilir
CREATE POLICY "Public can view active services" 
  ON services FOR SELECT 
  TO public 
  USING (is_active = true);

-- =============================================
-- APPOINTMENT CREATION POLICIES
-- =============================================

-- Online randevu oluşturma (isimsiz/public)
CREATE POLICY "Public can create online appointments"
  ON appointments FOR INSERT
  TO public
  WITH CHECK (source = 'online' AND status = 'pending');

-- Public sadece 'pending' statüsündeki KENDİ randevularını okuyabilir (randevu id'si varsa)
-- Ancak public user auth sisteminde olmadığı için bu RLS sadece server-side işlemlerinde bypass edilmeli
-- Güvenlik için, müşteriler sadece randevu numarası ve telefonla sorgulama yapabilecek API üzerinden kontrol edilmeli
CREATE POLICY "Public can view specific appointments"
  ON appointments FOR SELECT
  TO public
  USING (status = 'pending'); 

-- Bekleme listesine kayıt
CREATE POLICY "Public can join waitlist"
  ON waitlist FOR INSERT
  TO public
  WITH CHECK (true);

-- Müşteri oluşturma (randevu esnasında yeni müşteri kaydı)
CREATE POLICY "Public can create customers"
  ON customers FOR INSERT
  TO public
  WITH CHECK (true);

-- =============================================
-- SERVICE ROLE POLICIES (Admin Access)
-- =============================================
-- Not: Supabase Service Role Key kullanıldığında RLS otomatik olarak bypass edilir.
-- Next.js backend API (Admin panel) tüm işlemleri Service Role Key ile yapacağı için 
-- admin tarafında extra RLS kuralına gerek yoktur. RLS sadece "anon" key için güvenliği sağlar.
