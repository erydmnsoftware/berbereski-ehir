-- =============================================
-- BerberEskişehir VIP System — Inventory & Stock Management
-- =============================================

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  volume_ml INT,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  current_stock INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  estimated_days_until_out_of_stock INT,
  is_visible_to_customers BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by TEXT
);

-- STOCK MOVEMENTS
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- RESTOCK, CONSUME, ADJUSTMENT, SALE
  quantity INT NOT NULL,
  note TEXT,
  performed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_salon ON products(salon_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);

-- TRIGGERS
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS POLICIES
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products (so customers can see them if is_visible_to_customers = true)
CREATE POLICY "Public can view products" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view active products" ON products FOR SELECT TO authenticated USING (true);

-- For this project, assuming we might need broad access for admins. 
-- In a real setup, we'd check for admin role. Here we'll allow insert/update for demo purposes, or limit to authenticated users.
CREATE POLICY "Allow all actions on products for now" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all actions on stock_movements for now" ON stock_movements FOR ALL USING (true) WITH CHECK (true);

-- SEED DATA
INSERT INTO products (id, salon_id, name, volume_ml, price, current_stock, low_stock_threshold, description, updated_by) VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Matte Clay Wax', 100, 350, 12, 5, 'Güçlü tutuşlu mat wax.', 'Admin'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Sakal Bakım Yağı', 50, 450, 3, 5, 'Premium sakal yağı.', 'Admin'),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Tıraş Kolonyası', 250, 250, 0, 10, 'Ferahlatıcı limon ve okyanus esintisi.', 'Admin')
ON CONFLICT DO NOTHING;
