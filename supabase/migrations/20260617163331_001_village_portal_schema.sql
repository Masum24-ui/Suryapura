-- Village Portal Schema
-- Programs and Schemes
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('education', 'farmers', 'infrastructure', 'governance', 'digital')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
  beneficiaries INTEGER DEFAULT 0,
  budget TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Village News and Updates
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('announcement', 'event', 'achievement', 'alert')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grievances/Complaints
CREATE TABLE grievances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('roads', 'water', 'electricity', 'sanitation', 'other')),
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Village Stats
CREATE TABLE village_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_name TEXT NOT NULL,
  stat_value TEXT NOT NULL,
  stat_icon TEXT,
  category TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE village_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, authenticated write for demo purposes we'll allow public)
CREATE POLICY "programs_public_read" ON programs FOR SELECT TO public USING (true);
CREATE POLICY "programs_public_insert" ON programs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "programs_public_update" ON programs FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "news_public_read" ON news FOR SELECT TO public USING (true);
CREATE POLICY "news_public_insert" ON news FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "grievances_public_read" ON grievances FOR SELECT TO public USING (true);
CREATE POLICY "grievances_public_insert" ON grievances FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "grievances_public_update" ON grievances FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "village_stats_public_read" ON village_stats FOR SELECT TO public USING (true);
CREATE POLICY "village_stats_public_update" ON village_stats FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Seed initial data
INSERT INTO programs (title, description, category, status, beneficiaries, budget, image_url) VALUES
('Digital Literacy Camp', 'Free computer training for village youth aged 15-25. Learn basic computer skills, internet safety, and digital payments.', 'education', 'active', 156, '₹2,00,000', 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400'),
('School Renovation Project', 'Modernizing the village primary school with smart classrooms, library, and playground equipment.', 'education', 'active', 320, '₹15,00,000', 'https://images.pexels.com/photos/207681/pexels-photo-207681.jpeg?auto=compress&cs=tinysrgb&w=400'),
('PM Kisan Samman Nidhi', 'Direct income support of ₹6000 per year to eligible farmer families. Register at the Panchayat office.', 'farmers', 'active', 847, '₹18,000/year', 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Organic Farming Training', 'Workshops on organic farming techniques, vermicomposting, and natural pest control methods.', 'farmers', 'active', 234, '₹3,00,000', 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Village Road Connectivity', 'Construction of 12 km all-weather roads connecting all hamlets to the main village center.', 'infrastructure', 'active', 2890, '₹4.5 Crore', 'https://images.pexels.com/photos/219646/pexels-photo-219646.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Community Water Supply', 'Piped water supply project covering 95% households. Construction of 3 overhead tanks.', 'infrastructure', 'completed', 2890, '₹2.1 Crore', 'https://images.pexels.com/photos/1128358/pexels-photo-1128358.jpeg?auto=compress&cs=tinysrgb&w=400'),
('E-Gram Swaraj Portal', 'Online platform for Gram Panchayat meetings, fund allocation, and scheme monitoring.', 'governance', 'active', 2890, 'N/A', NULL),
('Village Digital ID', 'Every resident gets a unique digital identity card linked to all government services.', 'digital', 'active', 2156, 'Free', NULL);

INSERT INTO news (title, content, category, date, image_url) VALUES
('Weekly Health Camp Successful', 'Over 450 villagers received free health checkups at the primary health center. 23 cases referred for specialized treatment.', 'achievement', '2026-06-15', 'https://images.pexels.com/photos/236698/pexels-photo-236698.jpeg?auto=compress&cs=tinysrgb&w=400'),
('New Water Pipeline Inaugurated', 'MLA inaugurated the new pipeline connecting Ward 5 to the main supply. Now all 7 wards have 24/7 water access.', 'announcement', '2026-06-14', 'https://images.pexels.com/photos/1128358/pexels-photo-1128358.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Youth Sports Tournament', 'Annual village sports tournament begins on June 25. Cricket, Kabaddi, and athletics events for all age groups.', 'event', '2026-06-17', 'https://images.pexels.com/photos/2541319/pexels-photo-2541319.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Weather Alert', 'Heavy rainfall expected in the next 48 hours. Farmers advised to protect harvested crops. Emergency helpline active.', 'alert', '2026-06-16', NULL);

INSERT INTO village_stats (stat_name, stat_value, stat_icon, category) VALUES
('Total Population', '2,890', 'users', 'demographics'),
('Households', '567', 'home', 'demographics'),
('Literacy Rate', '78%', 'book-open', 'education'),
('Schools', '3', 'graduation-cap', 'education'),
('Farmer Families', '382', 'wheat', 'farmers'),
('Cultivated Land', '1,450 hectares', 'map', 'farmers'),
('Road Connectivity', '95%', 'route', 'infrastructure'),
('Water Access', '98%', 'droplet', 'infrastructure'),
('Digital ID Issued', '2,156', 'id-card', 'digital'),
('Active Schemes', '12', 'file-check', 'governance');

-- Insert some sample grievances
INSERT INTO grievances (name, phone, category, description, location, status) VALUES
('Ramu Kaka', '9876543210', 'roads', 'The approach road to Ward 4 is damaged due to recent rains. Multiple potholes making travel difficult.', 'Ward 4, Near Old Banyan Tree', 'in_progress'),
('Lakshmi Devi', '9876543211', 'water', 'Water supply is irregular for the past week. Only getting 30 mins of supply instead of 2 hours.', 'Ward 2, House No. 45', 'pending');
