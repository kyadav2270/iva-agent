// Comprehensive Due Diligence Data Models for IVA

export interface FinancialHealthCheck {
  burnRate: {
    monthly: number
    trend: 'increasing' | 'stable' | 'decreasing'
    sustainability: number // months of runway
    confidence: number // 0-100
  }
  revenueMetrics: {
    mrr?: number
    arr?: number
    growthRate: number // monthly %
    churnRate?: number
    ltv?: number
    cac?: number
    ltvCacRatio?: number
  }
  unitEconomics: {
    grossMargin: number
    contributionMargin: number
    paybackPeriod: number // months
    profitabilityScore: number // 0-100
  }
  fundingHistory: {
    totalRaised: number
    lastRoundSize: number
    lastRoundDate: string
    valuation?: number
    leadInvestors: string[]
  }
}

export interface LegalCompliance {
  regulatoryStatus: {
    licenses: string[]
    jurisdictions: string[]
    complianceScore: number // 0-100
    pendingApplications: string[]
  }
  intellectualProperty: {
    patents: IPAsset[]
    trademarks: IPAsset[]
    copyrights: IPAsset[]
    tradesecrets: string[]
    ipStrength: number // 0-100
  }
  litigationHistory: {
    activeCases: LegalCase[]
    settledCases: LegalCase[]
    riskScore: number // 0-100
  }
  corporateStructure: {
    jurisdiction: string
    entityType: string
    subsidiaries: string[]
    stakeholders: Stakeholder[]
    governance: GovernanceStructure
  }
  contracts: {
    customerAgreements: ContractAnalysis
    supplierAgreements: ContractAnalysis
    employmentAgreements: ContractAnalysis
    riskLevel: 'low' | 'medium' | 'high'
  }
}

export interface TechnicalDueDiligence {
  architecture: {
    scalabilityScore: number // 0-100
    modernityScore: number // 0-100
    securityScore: number // 0-100
    maintainabilityScore: number // 0-100
    technicalDebt: 'low' | 'medium' | 'high'
  }
  security: {
    certifications: string[]
    vulnerabilities: SecurityVulnerability[]
    dataProtection: DataProtectionScore
    incidentHistory: SecurityIncident[]
    overallScore: number // 0-100
  }
  development: {
    teamSize: number
    velocity: DevelopmentVelocity
    codeQuality: CodeQualityMetrics
    deploymentFrequency: string
    leadTime: string
    changeFailureRate: number
  }
  integration: {
    apiQuality: number // 0-100
    thirdPartyDependencies: Dependency[]
    dataIntegrations: DataIntegration[]
    platformCapabilities: PlatformCapability[]
  }
}

export interface MarketValidation {
  customerInsights: {
    interviews: CustomerInterview[]
    surveys: CustomerSurvey[]
    npsScore?: number
    satisfactionScore: number // 0-100
    churnReasons: string[]
  }
  competitiveAnalysis: {
    directCompetitors: Competitor[]
    indirectCompetitors: Competitor[]
    marketPosition: MarketPosition
    differentiationFactors: string[]
    competitiveAdvantage: number // 0-100
  }
  marketPenetration: {
    tam: number
    sam: number
    som: number
    currentPenetration: number // %
    growthPotential: number // 0-100
  }
  salesMetrics: {
    conversionRates: ConversionFunnel
    salesCycle: number // days
    averageDealSize: number
    customerAcquisitionChannels: AcquisitionChannel[]
  }
}

export interface TeamAssessment {
  founders: FounderProfile[]
  keyEmployees: EmployeeProfile[]
  boardMembers: BoardMember[]
  advisors: AdvisorProfile[]
  teamScore: {
    experienceScore: number // 0-100
    domainExpertise: number // 0-100
    executionCapability: number // 0-100
    cultureFit: number // 0-100
    keyPersonRisk: number // 0-100
  }
  hiring: {
    planNext12Months: HiringPlan
    talentPipeline: TalentPipelineScore
    compensationStrategy: CompensationAnalysis
    retentionRisk: number // 0-100
  }
}

// Supporting interfaces
export interface IPAsset {
  title: string
  registrationNumber: string
  status: 'pending' | 'granted' | 'expired'
  jurisdiction: string
  filingDate: string
  expiryDate?: string
  strength: number // 0-100
}

export interface LegalCase {
  title: string
  type: 'civil' | 'criminal' | 'regulatory'
  status: 'active' | 'settled' | 'dismissed'
  amount?: number
  description: string
  riskLevel: 'low' | 'medium' | 'high'
}

export interface Stakeholder {
  name: string
  role: string
  ownership: number // %
  votingRights: number // %
  liquidationPreference?: number
}

export interface GovernanceStructure {
  boardSize: number
  independentDirectors: number
  committees: string[]
  votingStructure: string
  protectiveProvisions: string[]
}

export interface ContractAnalysis {
  totalValue: number
  termLength: number // months
  keyTerms: string[]
  riskFactors: string[]
  riskScore: number // 0-100
}

export interface SecurityVulnerability {
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  status: 'open' | 'patched' | 'mitigated'
  discoveryDate: string
}

export interface DataProtectionScore {
  gdprCompliance: number // 0-100
  ccpaCompliance: number // 0-100
  dataMinimization: number // 0-100
  accessControls: number // 0-100
  encryption: number // 0-100
}

export interface SecurityIncident {
  date: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: string
  impact: string
  resolution: string
  lessonsLearned: string[]
}

export interface DevelopmentVelocity {
  sprintCapacity: number
  velocityTrend: 'increasing' | 'stable' | 'decreasing'
  blockerFrequency: number
  deliveryPredictability: number // 0-100
}

export interface CodeQualityMetrics {
  testCoverage: number // %
  technicalDebtRatio: number // %
  codeComplexity: number
  duplicatedLines: number // %
  maintainabilityIndex: number // 0-100
}

export interface Dependency {
  name: string
  version: string
  type: 'critical' | 'important' | 'optional'
  vulnerabilities: number
  lastUpdate: string
  riskScore: number // 0-100
}

export interface DataIntegration {
  provider: string
  type: string
  criticalityLevel: 'low' | 'medium' | 'high'
  latency: number // ms
  reliability: number // % uptime
}

export interface PlatformCapability {
  name: string
  maturityLevel: 'basic' | 'intermediate' | 'advanced'
  businessImpact: 'low' | 'medium' | 'high'
  competitiveAdvantage: boolean
}

export interface CustomerInterview {
  customerType: string
  satisfaction: number // 1-10
  likelihood: number // 1-10 NPS
  painPoints: string[]
  valueProposition: string[]
  improvementSuggestions: string[]
}

export interface CustomerSurvey {
  responseRate: number // %
  sampleSize: number
  avgSatisfaction: number // 1-10
  keyFindings: string[]
  actionItems: string[]
}

export interface Competitor {
  name: string
  marketShare: number // %
  strengths: string[]
  weaknesses: string[]
  pricing: string
  differentiationFactor: string
  threatLevel: 'low' | 'medium' | 'high'
}

export interface MarketPosition {
  ranking: number
  marketShare: number // %
  brandRecognition: number // 0-100
  customerLoyalty: number // 0-100
  pricingPower: number // 0-100
}

export interface ConversionFunnel {
  leads: number
  qualified: number
  opportunities: number
  closed: number
  conversionRate: number // %
}

export interface AcquisitionChannel {
  channel: string
  cost: number
  volume: number
  quality: number // 0-100
  roi: number
}

export interface FounderProfile {
  name: string
  role: string
  previousExperience: Experience[]
  education: Education[]
  networkStrength: number // 0-100
  domainExpertise: number // 0-100
  leadershipScore: number // 0-100
  commitmentLevel: number // 0-100
}

export interface EmployeeProfile {
  role: string
  experienceLevel: string
  performanceRating: number // 0-100
  retentionRisk: number // 0-100
  criticalityToCompany: 'low' | 'medium' | 'high'
}

export interface BoardMember {
  name: string
  background: string
  relevantExperience: string[]
  networkValue: number // 0-100
  activeContribution: number // 0-100
}

export interface AdvisorProfile {
  name: string
  expertise: string[]
  relevanceToCompany: number // 0-100
  activeInvolvement: number // 0-100
  networkValue: number // 0-100
}

export interface HiringPlan {
  totalPositions: number
  criticalPositions: string[]
  timeline: HiringTimeline[]
  budget: number
  successProbability: number // 0-100
}

export interface HiringTimeline {
  role: string
  startDate: string
  expectedCloseDate: string
  priority: 'low' | 'medium' | 'high'
}

export interface TalentPipelineScore {
  sourceQuality: number // 0-100
  responseRate: number // %
  conversionRate: number // %
  timeToHire: number // days
}

export interface CompensationAnalysis {
  marketCompetitiveness: number // 0-100
  equityAllocated: number // %
  retentionPackages: boolean
  performanceIncentives: boolean
  benchmarkScore: number // 0-100
}

export interface Experience {
  company: string
  role: string
  duration: string
  achievements: string[]
  relevanceScore: number // 0-100
}

export interface Education {
  institution: string
  degree: string
  field: string
  year: number
  prestige: number // 0-100
}

// Master Due Diligence Report
export interface ComprehensiveDDReport {
  companyId: string
  reportDate: string
  overallScore: number // 0-100
  recommendation: 'PASS' | 'WEAK_PASS' | 'CONSIDER' | 'STRONG_CONSIDER' | 'INVEST'
  
  // Core assessments
  financial: FinancialHealthCheck
  legal: LegalCompliance
  technical: TechnicalDueDiligence
  market: MarketValidation
  team: TeamAssessment
  
  // Analysis outputs
  keyFindings: string[]
  redFlags: string[]
  mitigationStrategies: string[]
  followUpActions: string[]
  
  // Investment considerations
  valuation: ValuationAnalysis
  termsheet: TermsheetAnalysis
  exitScenarios: ExitScenario[]
  
  // Confidence metrics
  dataQuality: number // 0-100
  analysisConfidence: number // 0-100
  informationGaps: string[]
}

export interface ValuationAnalysis {
  currentValuation?: number
  proposedValuation?: number
  comparableCompanies: ValuationComparable[]
  dcfAnalysis: DCFAnalysis
  marketMultiples: MarketMultiple[]
  fairValueRange: {
    low: number
    mid: number
    high: number
  }
}

export interface TermsheetAnalysis {
  proposedTerms: InvestmentTerms
  marketStandards: InvestmentTerms
  recommendations: string[]
  negotiationPriorities: string[]
}

export interface ExitScenario {
  type: 'IPO' | 'Strategic Sale' | 'Financial Sale'
  probability: number // 0-100
  timeline: string
  expectedValuation: number
  expectedReturn: number
  keyDependencies: string[]
}

export interface ValuationComparable {
  company: string
  stage: string
  valuation: number
  revenue: number
  multiple: number
  relevanceScore: number // 0-100
}

export interface DCFAnalysis {
  projectedCashFlows: number[]
  terminalValue: number
  discountRate: number
  npv: number
  irr: number
}

export interface MarketMultiple {
  metric: string
  multiple: number
  percentile: number
  applicability: number // 0-100
}

export interface InvestmentTerms {
  premoney: number
  postmoney: number
  ownership: number // %
  liquidationPreference: number
  participationRights: boolean
  antidilution: string
  boardSeats: number
  protectiveProvisions: string[]
  dragAlongRights: boolean
  tagAlongRights: boolean
}