-- Blog Content Seed Part 5: Final Posts to Complete 20+ Article Library

INSERT INTO blog_posts (title, slug, excerpt, content, author, read_time, category, tags, image_url, status, featured, published_at) VALUES

-- Suffolk County Codes
(
  'Suffolk County Electrical Codes & Permit Guide 2025',
  'suffolk-county-electrical-codes-permits',
  'Suffolk County electrical permit requirements, inspection procedures, and code compliance guide for homeowners and contractors.',
  '<h2>Suffolk County Electrical Code Overview</h2><p>Suffolk County municipalities each enforce electrical codes independently. Understanding Town of Huntington, Town of Smithtown, Town of Brookhaven, and other local requirements ensures successful projects.</p><h3>Common Permit Requirements</h3><ul><li>Panel and service upgrades</li><li>Generator installations</li><li>EV charger circuits</li><li>Pool electrical systems</li><li>Addition and renovation circuits</li></ul><p>Berman Electric handles all Suffolk County permits and inspections. Call (516) 361-4068 for expert service.</p>',
  'Rob Berman',
  '10 min read',
  'Codes & Regulations',
  ARRAY['Suffolk County', 'electrical codes', 'permits', 'Town of Huntington', 'Town of Smithtown'],
  '/lovable-uploads/hero-electrical-background.jpg',
  'published',
  false,
  NOW() - INTERVAL '18 days'
),

-- Smart Home Integration
(
  'Smart Home Electrical Setup Guide for Long Island',
  'smart-home-electrical-setup-long-island',
  'Complete guide to smart home electrical requirements. Wiring, circuits, and professional installation for smart lighting, thermostats, and automation.',
  '<h2>Electrical Foundation for Smart Homes</h2><p>Modern smart homes require proper electrical infrastructure. From smart lighting circuits to whole-home automation, professional electrical planning ensures reliable operation.</p><h3>Smart Device Power Requirements</h3><ul><li>Smart switches need neutral wires</li><li>Hub devices require always-on circuits</li><li>Security cameras need weatherproof outdoor power</li><li>Smart thermostats may need C-wire installation</li></ul><p>We install smart-ready electrical systems throughout Long Island. Call (516) 361-4068.</p>',
  'Rob Berman',
  '9 min read',
  'Smart Home',
  ARRAY['smart home', 'home automation', 'smart lighting', 'smart switches', 'Long Island'],
  '/lovable-uploads/hero-electrical-optimized.webp',
  'published',
  false,
  NOW() - INTERVAL '20 days'
),

-- Commercial Electrical
(
  'Commercial Electrical Services for Long Island Businesses',
  'commercial-electrical-services-long-island',
  'Expert commercial electrical services for Long Island restaurants, retail, medical offices, and industrial facilities. Licensed commercial electricians.',
  '<h2>Long Island Commercial Electrical Expertise</h2><p>Commercial electrical systems demand specialized knowledge and rapid response. Berman Electric serves restaurants, medical offices, retail stores, and industrial facilities across Nassau and Suffolk Counties.</p><h3>Commercial Services</h3><ul><li>Three-phase power installation</li><li>Commercial kitchen electrical</li><li>Retail lighting and power distribution</li><li>Medical facility electrical systems</li><li>Emergency power and generators</li><li>Code compliance upgrades</li></ul><p>Call (516) 361-4068 for commercial electrical service.</p>',
  'Rob Berman',
  '10 min read',
  'Commercial',
  ARRAY['commercial electrical', 'business electrical', 'restaurant electrical', 'medical office', 'Long Island'],
  '/lovable-uploads/5-electrical-mistakes-hero.png',
  'published',
  false,
  NOW() - INTERVAL '22 days'
);

-- Run all seed files in order:
-- 1. seed-blog-posts.sql
-- 2. seed-blog-posts-part2.sql  
-- 3. seed-blog-posts-part3.sql
-- 4. seed-blog-posts-part4.sql
-- 5. seed-blog-posts-part5.sql
