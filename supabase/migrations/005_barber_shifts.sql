-- =============================================
-- BARBER SHIFTS (Personel Özel Vardiyaları)
-- =============================================
CREATE TABLE IF NOT EXISTS barber_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_day_off BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(barber_id, shift_date)
);

-- Trigger for updated_at
CREATE TRIGGER update_barber_shifts_updated_at 
  BEFORE UPDATE ON barber_shifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Add admin_notification_phone to salons
ALTER TABLE salons ADD COLUMN IF NOT EXISTS admin_notification_phone TEXT;
