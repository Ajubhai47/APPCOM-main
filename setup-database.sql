-- This file is no longer needed as the application no longer uses Supabase
-- All data is now stored locally in the browser

-- The previous content was:
-- Create students table
-- CREATE TABLE students (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   name TEXT NOT NULL,
--   exam TEXT NOT NULL,
--   status TEXT DEFAULT 'offline'  -- Students are offline by default until they start a session
-- );

-- Create activity_events table
-- CREATE TABLE activity_events (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   student_id UUID REFERENCES students(id),
--   type TEXT NOT NULL,
--   details TEXT,
--   risk_score INTEGER DEFAULT 0  -- Risk scores are reduced by half in the application layer
-- );

-- Enable real-time for activity_events table
-- ALTER PUBLICATION supabase_realtime ADD TABLE activity_events;