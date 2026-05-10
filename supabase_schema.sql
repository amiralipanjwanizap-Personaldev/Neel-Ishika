-- Supabase Schema for Neel & Ishika Wedding App

-- Create events table
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue TEXT NOT NULL,
    map_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create rsvps table
CREATE TABLE public.rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    attending BOOLEAN NOT NULL,
    plus_one BOOLEAN DEFAULT false,
    dietary_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)

-- Events: Anyone can read, only authenticated users can insert/update/delete
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on events"
    ON public.events FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage events"
    ON public.events FOR ALL
    USING (auth.role() = 'authenticated');

-- RSVPs: Anyone can insert, only authenticated users can read/update/delete
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert access on rsvps"
    ON public.rsvps FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage rsvps"
    ON public.rsvps FOR ALL
    USING (auth.role() = 'authenticated');

-- Enable realtime for rsvps table
alter publication supabase_realtime add table rsvps;

-- Create page_views table
CREATE TABLE public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for page_views
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert access on page_views"
    ON public.page_views FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read page_views"
    ON public.page_views FOR SELECT
    USING (auth.role() = 'authenticated');
