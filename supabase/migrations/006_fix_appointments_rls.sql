-- Bu komutlar Supabase üzerinden Müşteriler sayfasındaki 'Tamamlandı' ve 'İptal'
-- işlemlerinin (UPDATE) veritabanına sorunsuzca yazılabilmesi için gereklidir.

-- 1. Randevular tablosu için GÜNCELLEME (UPDATE) yetkisini açıyoruz
DROP POLICY IF EXISTS "Public can update appointments" ON appointments;
CREATE POLICY "Public can update appointments" 
  ON appointments FOR UPDATE 
  TO anon 
  USING (true);

-- 2. İhtiyaç halinde müşteriler tablosu için de GÜNCELLEME yetkisini açıyoruz
DROP POLICY IF EXISTS "Public can update customers" ON customers;
CREATE POLICY "Public can update customers" 
  ON customers FOR UPDATE 
  TO anon 
  USING (true);
