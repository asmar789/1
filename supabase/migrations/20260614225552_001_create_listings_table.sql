-- Create listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('arac', 'ev', 'arsa', 'telefon')),
  images TEXT[] NOT NULL DEFAULT '{}',
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_category ON listings(category);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Public read access for listings
CREATE POLICY "listings_public_read" ON listings FOR SELECT
  TO public USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "listings_authenticated_insert" ON listings FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "listings_authenticated_update" ON listings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "listings_authenticated_delete" ON listings FOR DELETE
  TO authenticated USING (true);

-- Create admin_settings table for site configuration
CREATE TABLE admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  admin_email TEXT NOT NULL,
  admin_password_hash TEXT NOT NULL,
  site_title TEXT DEFAULT 'Silopi Sahibinden',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin (password: admin123 - should be changed)
INSERT INTO admin_settings (id, admin_email, admin_password_hash)
VALUES (1, 'admin@silopi.com', 'admin123');

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated can read admin settings
CREATE POLICY "admin_settings_authenticated_read" ON admin_settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "admin_settings_authenticated_update" ON admin_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);