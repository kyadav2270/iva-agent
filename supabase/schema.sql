-- IVA (Intelligent Venture Analyst) Database Schema
-- Execute this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table - stores startup information
CREATE TABLE companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    description TEXT,
    industry VARCHAR(100),
    stage VARCHAR(50),
    location VARCHAR(255),
    employee_count INTEGER,
    founded_year INTEGER,
    logo_url VARCHAR(500),
    pitch_deck_url VARCHAR(500),
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founders table - stores founder profiles
CREATE TABLE founders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    linkedin_url VARCHAR(500),
    previous_companies JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    experience_years INTEGER,
    fintech_experience BOOLEAN DEFAULT FALSE,
    previous_exits JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table - stores AI analysis results
CREATE TABLE evaluations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    team_score INTEGER CHECK (team_score >= 0 AND team_score <= 20),
    market_score INTEGER CHECK (market_score >= 0 AND market_score <= 20),
    product_score INTEGER CHECK (product_score >= 0 AND product_score <= 20),
    traction_score INTEGER CHECK (traction_score >= 0 AND traction_score <= 15),
    competitive_advantage_score INTEGER CHECK (competitive_advantage_score >= 0 AND competitive_advantage_score <= 15),
    business_model_score INTEGER CHECK (business_model_score >= 0 AND business_model_score <= 10),
    meets_criteria BOOLEAN DEFAULT FALSE,
    strengths TEXT[],
    red_flags TEXT[],
    investment_memo TEXT,
    due_diligence_questions TEXT[],
    recommendation VARCHAR(50) CHECK (recommendation IN ('PASS', 'WEAK_PASS', 'CONSIDER', 'STRONG_CONSIDER', 'INVEST')),
    evaluation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market insights table - stores market trend data
CREATE TABLE market_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    market_size_billion DECIMAL(10,2),
    growth_rate_percent DECIMAL(5,2),
    key_trends TEXT[],
    competitive_landscape JSONB DEFAULT '{}',
    regulatory_environment TEXT,
    market_timing_assessment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scoring criteria table - stores Impression Ventures specific criteria
CREATE TABLE scoring_criteria (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    weight INTEGER NOT NULL CHECK (weight >= 0 AND weight <= 100),
    description TEXT,
    is_essential BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default Impression Ventures criteria
INSERT INTO scoring_criteria (name, category, weight, description, is_essential) VALUES
('Fintech Industry Focus', 'industry', 0, 'Must be in fintech, insurtech, wealthtech, or banking tech', TRUE),
('Post-MVP Stage', 'stage', 0, 'Must have MVP and first customer', TRUE),
('North America Operations', 'geography', 0, 'Must have operations in North America', TRUE),
('Round Size 2M+', 'funding', 0, 'Must be raising $2M or more', TRUE),
('Team Experience', 'team', 20, 'Fintech background and previous exits', FALSE),
('Market Size', 'market', 20, 'TAM greater than $1B', FALSE),
('Product Innovation', 'product', 20, 'AI/ML, blockchain, or novel approach', FALSE),
('Traction', 'traction', 15, 'Customer validation and revenue growth', FALSE),
('Competitive Advantage', 'competitive', 15, 'Moat, IP, or network effects', FALSE),
('Business Model', 'business', 10, 'Scalable and recurring revenue', FALSE);

-- Create indexes for better performance
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_stage ON companies(stage);
CREATE INDEX idx_evaluations_score ON evaluations(overall_score DESC);
CREATE INDEX idx_evaluations_date ON evaluations(evaluation_date DESC);
CREATE INDEX idx_evaluations_recommendation ON evaluations(recommendation);
CREATE INDEX idx_founders_company ON founders(company_id);
CREATE INDEX idx_market_insights_company ON market_insights(company_id);

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_criteria ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - customize based on your auth needs)
CREATE POLICY "Allow all operations on companies" ON companies FOR ALL USING (true);
CREATE POLICY "Allow all operations on founders" ON founders FOR ALL USING (true);
CREATE POLICY "Allow all operations on evaluations" ON evaluations FOR ALL USING (true);
CREATE POLICY "Allow all operations on market_insights" ON market_insights FOR ALL USING (true);
CREATE POLICY "Allow all operations on scoring_criteria" ON scoring_criteria FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scoring_criteria_updated_at BEFORE UPDATE ON scoring_criteria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();