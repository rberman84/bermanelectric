-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Rob Berman',
  published_at TIMESTAMP WITH TIME ZONE,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for slug lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Published posts are viewable by everyone" 
ON public.blog_posts FOR SELECT 
USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Only admins can insert posts
CREATE POLICY "Admins can create posts" 
ON public.blog_posts FOR INSERT 
TO authenticated 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update posts
CREATE POLICY "Admins can update posts" 
ON public.blog_posts FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete posts
CREATE POLICY "Admins can delete posts" 
ON public.blog_posts FOR DELETE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, author, published_at, read_time, category, tags, image_url, featured, status) VALUES
('5 Electrical Mistakes Homeowners Make That Could Cost Thousands', '5-electrical-mistakes-homeowners-make-cost-thousands', 'Ever flipped a breaker and thought something''s weird? Learn the 5 most common electrical mistakes homeowners make and how to avoid costly repairs.', 'Full content here...', 'Rob Berman', '2024-02-10 12:00:00-05', '6 min read', 'Safety', ARRAY['electrical safety', 'home maintenance', 'DIY tips', 'cost savings', 'preventive maintenance'], '/lovable-uploads/5-electrical-mistakes-hero.png', true, 'published'),
('Top 5 Electrical Safety Tips for Long Island Homeowners', 'electrical-safety-tips-long-island-homeowners', 'Protect your family and home with these essential electrical safety tips every Long Island homeowner should know. From outlet safety to panel maintenance.', 'Full content here...', 'Rob Berman', '2024-01-20 12:00:00-05', '5 min read', 'Safety', ARRAY['electrical safety', 'home maintenance', 'Long Island', 'prevention'], '/lovable-uploads/a4a19e90-b47c-4918-b9e7-4a0153e7a336.png', true, 'published'),
('How to Know When It''s Time to Upgrade Your Electrical Panel', 'when-to-upgrade-electrical-panel', 'Is your electrical panel outdated? Learn the warning signs that indicate it''s time for an upgrade and why it''s crucial for your Long Island home''s safety.', 'Full content here...', 'Rob Berman', '2024-01-18 12:00:00-05', '7 min read', 'Upgrades', ARRAY['electrical panel', 'home upgrades', 'electrical safety', 'Suffolk County'], '/lovable-uploads/b61607ee-62cf-4e15-b67c-d0b367895173.png', true, 'published'),
('Why Licensed Electricians Save You Money in the Long Run', 'licensed-electricians-save-money', 'Discover why hiring a licensed electrician is always worth the investment. Avoid costly mistakes and ensure quality work that lasts.', 'Full content here...', 'Rob Berman', '2024-01-15 12:00:00-05', '6 min read', 'Tips', ARRAY['licensed electrician', 'cost savings', 'quality work', 'Nassau County'], '/lovable-uploads/07eb5a46-0431-494e-b24d-0535e767c757.png', false, 'published'),
('EV Charger Installation Guide for Long Island Homes', 'ev-charger-installation-guide-long-island', 'Planning to install an EV charger at home? Here''s everything Long Island homeowners need to know about permits, costs, and installation.', 'Full content here...', 'Rob Berman', '2024-01-12 12:00:00-05', '8 min read', 'EV Charging', ARRAY['EV charger', 'electric vehicle', 'home installation', 'Ronkonkoma'], '/lovable-uploads/75ea0479-7d50-48c5-8033-c17332ea08c3.png', false, 'published'),
('Hurricane Season Electrical Preparedness for Long Island', 'hurricane-electrical-preparedness-long-island', 'Protect your home''s electrical system during hurricane season. Essential tips for Long Island residents on generators, surge protection, and safety.', 'Full content here...', 'Rob Berman', '2024-01-10 12:00:00-05', '6 min read', 'Emergency Prep', ARRAY['hurricane preparation', 'generator installation', 'surge protection', 'emergency electrical'], '/lovable-uploads/9bf575d7-694f-4bc8-943d-7452fc34b82a.png', false, 'published'),
('Smart Home Electrical Upgrades Worth the Investment', 'smart-home-electrical-upgrades', 'Transform your Long Island home with smart electrical upgrades. From smart switches to automated lighting systems - what''s worth the investment?', 'Full content here...', 'Rob Berman', '2024-01-08 12:00:00-05', '7 min read', 'Smart Home', ARRAY['smart home', 'home automation', 'electrical upgrades', 'modern living'], '/lovable-uploads/c5858c5c-0ce3-4e8d-b5b5-79f91d0563a5.png', false, 'published');