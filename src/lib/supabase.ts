import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is required')
    }
    if (!supabaseAnonKey) {
      throw new Error('SUPABASE_ANON_KEY environment variable is required')
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Export the lazy-loaded client function
export function getSupabase() {
  return getSupabaseClient()
}

// Type definitions for our database schema
export interface Company {
  id: string
  name: string
  website?: string
  description?: string
  industry?: string
  stage?: string
  location?: string
  employee_count?: number
  founded_year?: number
  logo_url?: string
  pitch_deck_url?: string
  social_links?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Founder {
  id: string
  company_id: string
  name: string
  title?: string
  linkedin_url?: string
  previous_companies?: any[]
  education?: any[]
  experience_years?: number
  fintech_experience?: boolean
  previous_exits?: any[]
  created_at: string
}

export interface Evaluation {
  id: string
  company_id: string
  overall_score?: number
  team_score?: number
  market_score?: number
  product_score?: number
  traction_score?: number
  competitive_advantage_score?: number
  business_model_score?: number
  meets_criteria?: boolean
  strengths?: string[]
  red_flags?: string[]
  investment_memo?: string
  due_diligence_questions?: string[]
  recommendation?: 'PASS' | 'WEAK_PASS' | 'CONSIDER' | 'STRONG_CONSIDER' | 'INVEST'
  evaluation_date: string
  created_at: string
}

export interface MarketInsight {
  id: string
  company_id: string
  market_size_billion?: number
  growth_rate_percent?: number
  key_trends?: string[]
  competitive_landscape?: Record<string, any>
  regulatory_environment?: string
  market_timing_assessment?: string
  created_at: string
}

export interface ScoringCriteria {
  id: string
  name: string
  category: string
  weight: number
  description?: string
  is_essential?: boolean
  is_active?: boolean
  created_at: string
  updated_at: string
}

// Database helper functions
export class DatabaseService {
  // Companies
  static async createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await getSupabaseClient()
      .from('companies')
      .insert(company)
      .select()
      .single()
    
    if (error) throw error
    return data as Company
  }

  static async getCompany(id: string) {
    const { data, error } = await getSupabaseClient()
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Company
  }

  static async getCompanyByName(name: string) {
    const { data, error } = await getSupabaseClient()
      .from('companies')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as Company | null
  }

  static async updateCompany(id: string, updates: Partial<Company>) {
    const { data, error } = await getSupabaseClient()
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Company
  }

  // Evaluations
  static async createEvaluation(evaluation: Omit<Evaluation, 'id' | 'created_at'>) {
    const { data, error } = await getSupabaseClient()
      .from('evaluations')
      .insert(evaluation)
      .select()
      .single()
    
    if (error) throw error
    return data as Evaluation
  }

  static async getEvaluation(id: string) {
    const { data, error } = await getSupabaseClient()
      .from('evaluations')
      .select(`
        *,
        companies (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async getEvaluationsByCompany(companyId: string) {
    const { data, error } = await getSupabaseClient()
      .from('evaluations')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Evaluation[]
  }

  static async getRecentEvaluations(limit = 10) {
    const { data, error } = await getSupabaseClient()
      .from('evaluations')
      .select(`
        *,
        companies (name, website, industry)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }

  static async getHighScoreEvaluations(minScore = 70, limit = 10) {
    const { data, error } = await getSupabaseClient()
      .from('evaluations')
      .select(`
        *,
        companies (name, website, industry)
      `)
      .gte('overall_score', minScore)
      .order('overall_score', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }

  // Founders
  static async createFounder(founder: Omit<Founder, 'id' | 'created_at'>) {
    const { data, error } = await getSupabaseClient()
      .from('founders')
      .insert(founder)
      .select()
      .single()
    
    if (error) throw error
    return data as Founder
  }

  static async getFoundersByCompany(companyId: string) {
    const { data, error } = await getSupabaseClient()
      .from('founders')
      .select('*')
      .eq('company_id', companyId)
    
    if (error) throw error
    return data as Founder[]
  }

  // Market Insights
  static async createMarketInsight(insight: Omit<MarketInsight, 'id' | 'created_at'>) {
    const { data, error } = await getSupabaseClient()
      .from('market_insights')
      .insert(insight)
      .select()
      .single()
    
    if (error) throw error
    return data as MarketInsight
  }

  static async getMarketInsightByCompany(companyId: string) {
    const { data, error } = await getSupabaseClient()
      .from('market_insights')
      .select('*')
      .eq('company_id', companyId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as MarketInsight | null
  }

  // Scoring Criteria
  static async getScoringCriteria() {
    const { data, error } = await getSupabaseClient()
      .from('scoring_criteria')
      .select('*')
      .eq('is_active', true)
      .order('weight', { ascending: false })
    
    if (error) throw error
    return data as ScoringCriteria[]
  }

  static async updateScoringCriteria(id: string, updates: Partial<ScoringCriteria>) {
    const { data, error } = await getSupabaseClient()
      .from('scoring_criteria')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as ScoringCriteria
  }
}