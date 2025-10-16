-- Political Debate School Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Basic Information
    name VARCHAR(100) NOT NULL,
    age_range VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    occupation VARCHAR(100),
    location VARCHAR(100),

    -- Political Orientation
    political_orientation VARCHAR(50) NOT NULL,
    orientation_description TEXT,

    -- Experience and Motivation
    debate_experience VARCHAR(50),
    experience_detail TEXT,
    motivation TEXT NOT NULL,
    expectations TEXT NOT NULL,

    -- Interests
    topics JSONB, -- Array of selected topics
    weakness TEXT,

    -- Additional Information
    referrer VARCHAR(100),
    how_found VARCHAR(50),
    additional_notes TEXT,

    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewing, accepted, rejected
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,

    -- Metadata
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_political_orientation ON applications(political_orientation);

-- Create a view for application statistics
CREATE OR REPLACE VIEW application_stats AS
SELECT
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_count,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
    COUNT(CASE WHEN political_orientation = '진보' THEN 1 END) as progressive_count,
    COUNT(CASE WHEN political_orientation = '중도' THEN 1 END) as moderate_count,
    COUNT(CASE WHEN political_orientation = '보수' THEN 1 END) as conservative_count,
    COUNT(CASE WHEN political_orientation = '기타' THEN 1 END) as other_orientation_count
FROM applications;

-- Create a function to get diversity score
CREATE OR REPLACE FUNCTION calculate_diversity_score()
RETURNS TABLE(
    progressive_ratio NUMERIC,
    moderate_ratio NUMERIC,
    conservative_ratio NUMERIC,
    diversity_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH counts AS (
        SELECT
            COUNT(*) FILTER (WHERE political_orientation = '진보') as prog_count,
            COUNT(*) FILTER (WHERE political_orientation = '중도') as mod_count,
            COUNT(*) FILTER (WHERE political_orientation = '보수') as cons_count,
            COUNT(*) as total
        FROM applications
        WHERE status = 'accepted'
    )
    SELECT
        ROUND(prog_count::NUMERIC / NULLIF(total, 0), 2) as progressive_ratio,
        ROUND(mod_count::NUMERIC / NULLIF(total, 0), 2) as moderate_ratio,
        ROUND(cons_count::NUMERIC / NULLIF(total, 0), 2) as conservative_ratio,
        ROUND(1.0 - (
            POWER(prog_count::NUMERIC / NULLIF(total, 0) - 0.33, 2) +
            POWER(mod_count::NUMERIC / NULLIF(total, 0) - 0.33, 2) +
            POWER(cons_count::NUMERIC / NULLIF(total, 0) - 0.33, 2)
        ), 2) as diversity_score
    FROM counts;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anyone to insert (public can submit applications)
CREATE POLICY "Allow public to insert applications"
    ON applications
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Only authenticated users can view applications (admin panel)
CREATE POLICY "Allow authenticated users to view applications"
    ON applications
    FOR SELECT
    TO authenticated
    USING (true);

-- Only authenticated users can update applications (admin panel)
CREATE POLICY "Allow authenticated users to update applications"
    ON applications
    FOR UPDATE
    TO authenticated
    USING (true);

-- Create a table for email notifications log
CREATE TABLE IF NOT EXISTS notification_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL, -- 'confirmation', 'acceptance', 'rejection'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status VARCHAR(20) DEFAULT 'sent', -- sent, failed, pending
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_notification_log_application_id ON notification_log(application_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_sent_at ON notification_log(sent_at DESC);

-- Create a function to send automatic confirmation email (trigger)
CREATE OR REPLACE FUNCTION send_confirmation_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Log that a confirmation should be sent
    INSERT INTO notification_log (application_id, email_type, status)
    VALUES (NEW.id, 'confirmation', 'pending');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new applications
CREATE TRIGGER on_application_submit
    AFTER INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION send_confirmation_notification();

-- Comments for documentation
COMMENT ON TABLE applications IS 'Stores all application submissions for the Political Debate School';
COMMENT ON COLUMN applications.status IS 'Application review status: pending, reviewing, accepted, rejected';
COMMENT ON COLUMN applications.topics IS 'JSON array of selected political topics of interest';
COMMENT ON TABLE notification_log IS 'Logs all email notifications sent to applicants';
