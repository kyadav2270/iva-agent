// Specialized AI prompts for different fintech verticals and analysis scenarios

export const ANALYSIS_PROMPTS = {
  
  // Insurance Technology Analysis
  insurtech: `
You are analyzing an InsurTech startup for Impression Ventures. Focus on these key areas:

INSURTECH-SPECIFIC CRITERIA:
1. Distribution Innovation: New channels, embedded insurance, API distribution
2. Underwriting Technology: AI/ML for risk assessment, alternative data sources
3. Claims Processing: Automation, fraud detection, customer experience
4. Product Innovation: Parametric insurance, micro-insurance, usage-based models
5. B2B vs B2C: Preference for B2B solutions serving traditional insurers

KEY QUESTIONS TO EVALUATE:
- Does this solve a real pain point for insurers or consumers?
- Is the technology defensible and hard to replicate?
- What regulatory hurdles exist and how are they addressed?
- How does this integrate with existing insurance infrastructure?
- What is the claims processing improvement and cost savings?

SCORING FOCUS:
- Regulatory compliance and insurance domain expertise (critical)
- Partnership potential with traditional insurers
- Data advantages and proprietary risk models
- Scalability of the technology platform
- Customer acquisition cost and retention in insurance

Provide detailed analysis on insurance market dynamics, regulatory environment, and competitive positioning.
  `,

  // Robo-Advisory and WealthTech Analysis  
  wealthtech: `
You are analyzing a WealthTech/Robo-Advisory startup for Impression Ventures. Focus on these areas:

WEALTHTECH-SPECIFIC CRITERIA:
1. Investment Management Technology: Portfolio optimization, rebalancing, tax optimization
2. Client Experience: Digital onboarding, financial planning tools, advisor platforms
3. Compliance & Custody: RIA compliance, custodial relationships, fiduciary responsibility
4. Target Market: Mass affluent, HNW, advisors, or institutional clients
5. Revenue Model: AUM fees, subscription, transaction-based, or advisor tools

KEY QUESTIONS TO EVALUATE:
- What is the investment methodology and performance track record?
- How does this differentiate from existing robo-advisors (Betterment, Wealthfront)?
- What is the regulatory status and compliance framework?
- Who are the custodial partners and what are the integrations?
- What is the client acquisition cost and minimum account size?

SCORING FOCUS:
- Fiduciary compliance and regulatory adherence
- Investment performance and methodology sophistication
- Technology platform scalability and API capabilities
- Advisor adoption (if B2B) or client retention (if B2C)
- Integration with existing wealth management infrastructure

Analyze the competitive landscape in wealth management and differentiation strategy.
  `,

  // Credit and Lending Innovation
  lending: `
You are analyzing a Credit/Lending innovation startup for Impression Ventures. Focus on these areas:

LENDING-SPECIFIC CRITERIA:
1. Credit Assessment Innovation: Alternative data, AI/ML underwriting, real-time decisioning
2. Risk Management: Portfolio performance, default prediction, loss mitigation
3. Regulatory Compliance: FCRA, ECOA, state lending laws, consumer protection
4. Target Segment: SMB, consumer, real estate, auto, student, or specialty lending
5. Capital Strategy: Balance sheet, marketplace, or technology licensing model

KEY QUESTIONS TO EVALUATE:
- What is the default rate and loss performance compared to traditional lending?
- How does the underwriting model work and what data sources are used?
- What is the regulatory compliance framework and state licensing status?
- How is capital sourced and what are the unit economics?
- What is the competitive advantage vs traditional lenders and fintechs?

SCORING FOCUS:
- Credit performance and risk management sophistication
- Regulatory compliance and consumer protection measures
- Technology platform and API capabilities for partners
- Capital efficiency and pathway to profitability
- Market size and competition in target lending segment

Provide analysis on credit risk, regulatory environment, and sustainable competitive advantages.
  `,

  // Payment Infrastructure and Processing
  payments: `
You are analyzing a Payment Infrastructure startup for Impression Ventures. Focus on these areas:

PAYMENTS-SPECIFIC CRITERIA:
1. Infrastructure Innovation: APIs, real-time processing, cross-border, embedded payments
2. Vertical Specialization: Industry-specific solutions, marketplace payments, B2B payments
3. Technology Platform: Modern architecture, developer experience, reliability/uptime
4. Compliance Framework: PCI compliance, money transmission licenses, international regulations
5. Economic Model: Interchange capture, SaaS fees, transaction volume pricing

KEY QUESTIONS TO EVALUATE:
- How does this differentiate from Stripe, Square, and other payment processors?
- What is the technical architecture and developer adoption strategy?
- What compliance certifications and licenses are in place?
- What are the transaction volumes, processing costs, and take rates?
- How does this integrate with existing financial infrastructure?

SCORING FOCUS:
- Technical innovation and developer experience quality
- Compliance and regulatory adherence across jurisdictions
- Transaction volume growth and merchant retention
- Take rate sustainability and competitive positioning
- Platform scalability and infrastructure reliability

Analyze the payments competitive landscape and sustainable differentiation strategies.
  `,

  // Banking Technology and Infrastructure
  banktech: `
You are analyzing a Banking Technology startup for Impression Ventures. Focus on these areas:

BANKTECH-SPECIFIC CRITERIA:
1. Core Banking Modernization: API-first architecture, microservices, cloud-native solutions
2. Digital Banking Experience: Mobile apps, digital onboarding, customer experience
3. Compliance Technology: KYC/AML, regulatory reporting, audit trails, risk management
4. Infrastructure Services: Payment rails, data analytics, cybersecurity, fraud prevention
5. Partnership Model: White-label, API licensing, or full-stack banking solutions

KEY QUESTIONS TO EVALUATE:
- How does this help traditional banks compete with digital challengers?
- What is the implementation timeline and integration complexity?
- What regulatory certifications and bank partnerships exist?
- How does this compare to existing core banking vendors (FIS, Jack Henry)?
- What are the cost savings and revenue opportunities for bank clients?

SCORING FOCUS:
- Bank partnership validation and implementation success
- Regulatory compliance and security certifications
- Technology platform scalability and modern architecture
- Cost reduction and revenue generation for bank clients
- Competitive positioning vs legacy banking technology vendors

Provide analysis on banking industry trends, digital transformation needs, and competitive dynamics.
  `,

  // Regulatory Technology (RegTech)
  regtech: `
You are analyzing a RegTech startup for Impression Ventures. Focus on these areas:

REGTECH-SPECIFIC CRITERIA:
1. Compliance Automation: KYC/AML, transaction monitoring, regulatory reporting
2. Risk Management: Operational risk, credit risk, market risk, model validation
3. Audit & Governance: Internal controls, audit trails, board reporting, stress testing
4. Data Management: Data lineage, data quality, regulatory data aggregation
5. Regulatory Scope: Banking, securities, insurance, or cross-functional compliance

KEY QUESTIONS TO EVALUATE:
- Which specific regulations does this address and how comprehensively?
- What is the accuracy of compliance detection and false positive rates?
- How does this integrate with existing bank compliance infrastructure?
- What regulatory validation or endorsements exist?
- What are the cost savings and efficiency gains for compliance teams?

SCORING FOCUS:
- Regulatory expertise and domain knowledge depth
- Technology accuracy and false positive/negative rates
- Integration capabilities with existing compliance systems
- Cost reduction and efficiency improvements for clients
- Regulatory endorsements and validation by authorities

Analyze the regulatory landscape, compliance requirements, and technology adoption in financial services.
  `,

  // General Fintech Analysis (default)
  general: `
You are analyzing a fintech startup for Impression Ventures, a seed-stage venture capital firm focused on financial technology.

IMPRESSION VENTURES INVESTMENT FOCUS:
- Fintech companies disrupting traditional financial services
- B2B solutions preferred over B2C consumer applications  
- API-first and infrastructure companies that enable other businesses
- Strong regulatory compliance and domain expertise required
- Preference for companies serving traditional financial institutions

ANALYSIS FRAMEWORK:
1. Market Opportunity: Size, growth rate, timing, and competitive dynamics
2. Product Innovation: Technology differentiation, IP, and customer value proposition  
3. Team Expertise: Fintech domain knowledge, execution capability, previous exits
4. Traction Validation: Customer adoption, revenue growth, partnership pipeline
5. Business Model: Scalability, unit economics, recurring revenue potential
6. Competitive Positioning: Moat, barriers to entry, sustainable advantages

SCORING CONSIDERATIONS:
- Essential fit with Impression Ventures thesis (fintech focus, B2B preference)
- Team experience in financial services or previous successful exits
- Technology platform that can scale and serve enterprise clients
- Clear path to $100M+ revenue and attractive venture returns
- Strong regulatory compliance and risk management capabilities

Provide a comprehensive analysis that evaluates investment attractiveness specifically for Impression Ventures' portfolio and thesis.
  `
}

// Context-aware prompt selector
export class PromptSelector {
  
  static selectAnalysisPrompt(companyData: any): string {
    const description = (companyData.description || '').toLowerCase()
    const industry = (companyData.industry || '').toLowerCase()
    const name = (companyData.name || '').toLowerCase()
    
    // Insurance technology detection
    if (this.containsAny(description + industry + name, [
      'insurance', 'insurtech', 'claims', 'underwriting', 'actuarial', 'risk assessment'
    ])) {
      return ANALYSIS_PROMPTS.insurtech
    }
    
    // Wealth management and robo-advisory detection
    if (this.containsAny(description + industry + name, [
      'wealth', 'robo', 'advisory', 'investment', 'portfolio', 'financial planning', 'ria'
    ])) {
      return ANALYSIS_PROMPTS.wealthtech
    }
    
    // Lending and credit detection
    if (this.containsAny(description + industry + name, [
      'lending', 'credit', 'loan', 'underwriting', 'fico', 'alternative credit', 'marketplace lending'
    ])) {
      return ANALYSIS_PROMPTS.lending
    }
    
    // Payments detection
    if (this.containsAny(description + industry + name, [
      'payment', 'payments', 'processing', 'merchant', 'pos', 'gateway', 'acquiring'
    ])) {
      return ANALYSIS_PROMPTS.payments
    }
    
    // Banking technology detection
    if (this.containsAny(description + industry + name, [
      'banking', 'core banking', 'digital bank', 'neobank', 'bank infrastructure', 'bank platform'
    ])) {
      return ANALYSIS_PROMPTS.banktech
    }
    
    // RegTech detection
    if (this.containsAny(description + industry + name, [
      'compliance', 'regulatory', 'kyc', 'aml', 'regtech', 'audit', 'risk management'
    ])) {
      return ANALYSIS_PROMPTS.regtech
    }
    
    // Default to general fintech analysis
    return ANALYSIS_PROMPTS.general
  }
  
  private static containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword))
  }
}

// Investment memo templates by vertical
export const MEMO_TEMPLATES = {
  
  header: `
IMPRESSION VENTURES
Investment Evaluation Memo

Company: {{company_name}}
Date: {{evaluation_date}}
Analyst: IVA (Intelligent Venture Analyst)
Overall Score: {{overall_score}}/100
Recommendation: {{recommendation}}
  `,
  
  executive_summary: `
EXECUTIVE SUMMARY

{{company_name}} is a {{industry}} company {{company_description}}. 

Key Investment Highlights:
• {{strength_1}}
• {{strength_2}} 
• {{strength_3}}

Primary Concerns:
• {{red_flag_1}}
• {{red_flag_2}}

Investment Recommendation: {{recommendation}} ({{overall_score}}/100)
  `,
  
  investment_thesis: `
INVESTMENT THESIS

Impression Ventures Fit: {{thesis_fit_explanation}}

Market Opportunity: {{market_opportunity_summary}}

Competitive Positioning: {{competitive_advantages}}

Why Now: {{market_timing_rationale}}
  `,
  
  due_diligence_section: `
RECOMMENDED DUE DILIGENCE

Priority Questions:
{{priority_questions}}

Technical Validation:
{{technical_questions}}

Business Validation:
{{business_questions}}

Financial Validation:
{{financial_questions}}
  `
}