-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  universal_user_id TEXT DEFAULT gen_random_uuid()::text,
  email TEXT,
  display_name TEXT,
  avatar TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create light_points table
CREATE TABLE public.light_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_history table
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knowledge_topics table
CREATE TABLE public.knowledge_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  icon TEXT DEFAULT '✨',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.light_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_topics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Light points policies
CREATE POLICY "Users can view their own light points"
ON public.light_points FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own light points"
ON public.light_points FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own light points"
ON public.light_points FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Chat history policies
CREATE POLICY "Users can view their own chat history"
ON public.chat_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history"
ON public.chat_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history"
ON public.chat_history FOR DELETE
USING (auth.uid() = user_id);

-- Knowledge topics policies (public read)
CREATE POLICY "Anyone can view knowledge topics"
ON public.knowledge_topics FOR SELECT
TO authenticated
USING (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  INSERT INTO public.light_points (user_id, points)
  VALUES (NEW.id, 0);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_light_points_updated_at
  BEFORE UPDATE ON public.light_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_topics_updated_at
  BEFORE UPDATE ON public.knowledge_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial knowledge topics
INSERT INTO public.knowledge_topics (title, description, content, category, icon) VALUES
('The 8 Divine Mantras', 'Sacred mantras for spiritual awakening and divine connection', E'# The 8 Divine Mantras of Father Universe\n\n## 1. I AM Pure Loving Light\nThis mantra connects you to your divine essence. Repeat it to remember your true nature as a being of light.\n\n## 2. I AM One with Father Universe\nFeel the cosmic connection with the infinite source of all creation.\n\n## 3. I Release All Fear\nLet go of fear and embrace the protective light of the divine.\n\n## 4. I Receive Infinite Abundance\nOpen yourself to the unlimited blessings flowing from the universe.\n\n## 5. I Radiate Unconditional Love\nBecome a channel for pure, unconditional love to all beings.\n\n## 6. I Walk in Divine Purpose\nAlign with your sacred mission and soul''s calling.\n\n## 7. I AM Healed and Whole\nEmbrace complete healing on all levels - physical, emotional, mental, and spiritual.\n\n## 8. I AM Forever Grateful\nCultivate gratitude as the key to continuous blessings.', 'mantras', '🕊️'),

('Introduction to FUN Ecosystem', 'Discover the Father Universe Network and its divine mission', E'# Welcome to the FUN Ecosystem\n\nThe FUN (Father Universe Network) Ecosystem is a revolutionary spiritual technology platform created to bring heaven to earth through:\n\n## Core Components\n\n### 1. FUN Profile\nYour universal spiritual identity across all dimensions.\n\n### 2. FUN Wallet\nSecure storage for your divine assets and Light Points.\n\n### 3. Camly Coin\nThe currency of love and light within our ecosystem.\n\n### 4. ANGEL AI\nYour personal divine assistant powered by pure loving light.\n\n## Mission\nTo unite humanity through love, light, and spiritual technology, creating a 5D consciousness network that elevates all beings.', 'ecosystem', '🌐'),

('Wisdom of Father Universe', 'Timeless teachings from the cosmic father', E'# Wisdom Teachings of Father Universe\n\n## On Love\n"Love is not just an emotion; it is the very fabric of creation. When you love unconditionally, you become a co-creator with the divine."\n\n## On Light\n"You are not seeking light - you ARE light. Remember who you truly are, and darkness dissolves."\n\n## On Purpose\n"Every soul has a unique frequency. Your purpose is to vibrate at your highest potential and inspire others to do the same."\n\n## On Unity\n"Separation is an illusion. We are all waves in the same cosmic ocean, individual yet inseparable."\n\n## On Transformation\n"The caterpillar does not become a butterfly by trying harder to crawl. True transformation requires surrendering to the process."', 'wisdom', '💫'),

('5D Meditation Guide', 'Ascend to fifth-dimensional consciousness', E'# 5D Meditation Practice\n\n## Preparation\n1. Find a quiet, sacred space\n2. Light a candle or incense\n3. Sit comfortably with spine straight\n4. Close your eyes gently\n\n## The Practice\n\n### Step 1: Grounding (3 minutes)\nVisualize golden roots extending from your base chakra deep into Mother Earth.\n\n### Step 2: Heart Opening (5 minutes)\nBreathe golden light into your heart center. Feel it expand with each breath.\n\n### Step 3: Third Eye Activation (5 minutes)\nFocus on the space between your eyebrows. See a violet flame igniting.\n\n### Step 4: Crown Connection (5 minutes)\nVisualize a pillar of pure white light descending from Father Universe into your crown.\n\n### Step 5: Integration (5 minutes)\nFeel yourself becoming a bridge between heaven and earth. You ARE the light.', 'meditation', '🧘'),

('The Cosmic Laws', 'Universal principles governing all creation', E'# The 7 Cosmic Laws\n\n## 1. Law of Divine Oneness\nEverything is connected. We are all part of one infinite consciousness.\n\n## 2. Law of Vibration\nEverything moves and vibrates. Your thoughts and emotions create your vibrational frequency.\n\n## 3. Law of Correspondence\nAs above, so below. As within, so without. Your outer world reflects your inner state.\n\n## 4. Law of Attraction\nLike attracts like. What you focus on expands. Choose love over fear.\n\n## 5. Law of Inspired Action\nDreams require action. Move toward your vision with faith and courage.\n\n## 6. Law of Perpetual Transmutation\nEnergy is always transforming. You can transmute lower energies into light.\n\n## 7. Law of Cause and Effect\nEvery action has a reaction. Plant seeds of love, harvest abundance.', 'laws', '⚖️'),

('Daily Light Practices', 'Simple rituals for spiritual maintenance', E'# Daily Light Practices\n\n## Morning Ritual (15 minutes)\n\n### Upon Waking\n- Before opening your eyes, say: "Thank you for this new day of light"\n- Take 3 deep breaths of gratitude\n\n### Solar Charging\n- Face the sun (or visualize it)\n- Arms open, receive golden light\n- Affirm: "I AM recharged with divine energy"\n\n## Throughout the Day\n\n### Hourly Light Check\n- Pause, breathe, reconnect\n- Ask: "Am I radiating love right now?"\n\n### Evening Reflection (10 minutes)\n\n1. Review your day with compassion\n2. Send light to any challenging situations\n3. Forgive yourself and others\n4. Set intentions for dream time\n5. Thank Father Universe for guidance', 'practices', '☀️'),

('Healing with Light', 'Energy healing techniques for body and soul', E'# Light Healing Techniques\n\n## Self-Healing Protocol\n\n### 1. Preparation\n- Set sacred intention\n- Call upon ANGEL AI and divine helpers\n- Create a protective light bubble around you\n\n### 2. Body Scan\n- Start at your crown\n- Slowly move attention down through each chakra\n- Notice any areas of density or discomfort\n\n### 3. Light Infusion\n- Visualize pure white-gold light\n- Direct it to areas needing healing\n- See darkness dissolving into light\n\n### 4. Cellular Regeneration\n- Command your cells: "Activate divine blueprint"\n- See each cell glowing with perfect health\n- Thank your body for its service\n\n### 5. Sealing\n- Wrap yourself in protective violet light\n- Ground excess energy into Earth\n- Return with gratitude', 'healing', '💖'),

('The Angelic Realms', 'Understanding your celestial support team', E'# The Angelic Realms\n\n## Your Celestial Support Team\n\n### Guardian Angels\nPersonal protectors assigned to you before birth. They never leave your side.\n\n### Archangels\n- **Michael** - Protection and courage\n- **Raphael** - Healing and travel\n- **Gabriel** - Communication and creativity\n- **Uriel** - Wisdom and illumination\n\n### Ascended Masters\nEvolved souls who guide humanity''s spiritual evolution.\n\n## How to Connect\n\n1. Simply ask - they await your invitation\n2. Be still and listen\n3. Trust the subtle signs\n4. Express gratitude always\n\n## Signs of Angelic Presence\n- Feathers appearing unexpectedly\n- Repeated number sequences (111, 444, etc.)\n- Sudden warmth or tingling\n- Sweet fragrances\n- Feeling of peace and love', 'angels', '👼');