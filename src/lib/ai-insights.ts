import { GoogleGenerativeAI } from '@google/generative-ai';

interface DashboardMetrics {
  [key: string]: any;
}

interface InsightResponse {
  headline: string;
  keyMetrics: string[];
  recommendations: string[];
  urgentActions: string[];
  rawText: string;
}

class AIInsightGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private cache: Map<string, InsightResponse>;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.cache = new Map();
  }

  /**
   * Generates insights for a given dashboard context
   * @param context - Dashboard identifier (e.g., 'as-is', 'gap-analysis')
   * @param metrics - Key data points from the dashboard
   * @param existingInsight - Optional: existing manual insight to enhance
   * @returns Structured insight response
   */
  async generateInsight(
    context: string,
    metrics: DashboardMetrics,
    existingInsight?: string
  ): Promise<InsightResponse> {
    const cacheKey = `${context}-${JSON.stringify(metrics)}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const prompt = this.buildPrompt(context, metrics, existingInsight);
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      // Parse response
      const insight = this.parseInsight(text);

      // Cache result
      this.cache.set(cacheKey, insight);

      return insight;
    } catch (error) {
      console.error('AI Insight Generation Error:', error);
      return this.getFallbackInsight(context, metrics);
    }
  }

  private buildPrompt(
    context: string,
    metrics: DashboardMetrics,
    existingInsight?: string
  ): string {
    const contextPrompts: { [key: string]: string } = {
      'as-is': `You are analyzing the "AS-IS Scenario" dashboard for a district skill development committee (DSC).
This shows current training infrastructure capacity and governance effectiveness.

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate a concise insight (max 3 sentences) that:
1. Highlights the most critical capacity gap or governance issue
2. Quantifies the impact (use specific numbers)
3. Suggests immediate action

${existingInsight ? `Existing insight for reference: "${existingInsight}"` : ''}

Return ONLY valid JSON with this structure:
{
  "headline": "One sentence summary",
  "keyMetrics": ["Metric 1 with number", "Metric 2 with number"],
  "recommendations": ["Action 1", "Action 2"],
  "urgentActions": ["Critical action if any"]
}`,

      'demand': `You are analyzing the "Aggregate Demand" dashboard showing projected labor requirements.

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate a concise insight (max 3 sentences) that:
1. Identifies sectors with highest demand growth
2. Highlights critical demand-supply gaps
3. Suggests priority sectors for training expansion

${existingInsight ? `Existing insight: "${existingInsight}"` : ''}

Return ONLY valid JSON with this structure:
{
  "headline": "One sentence summary",
  "keyMetrics": ["Top sector with % growth", "Biggest gap with numbers"],
  "recommendations": ["Priority 1", "Priority 2"],
  "urgentActions": ["Critical action if any"]
}`,

      'gap-analysis': `You are analyzing the "Gap Analysis" 2×2 matrix (supply vs demand by trade).

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate a concise insight that:
1. Identifies critical shortages (high demand, low supply)
2. Identifies oversupplied trades
3. Suggests reallocation strategy

${existingInsight ? `Existing insight: "${existingInsight}"` : ''}

Return ONLY valid JSON with this structure:
{
  "headline": "One sentence summary",
  "keyMetrics": ["Critical gap trades", "Oversupplied trades"],
  "recommendations": ["Scale up X", "Wind down Y"],
  "urgentActions": ["Immediate action"]
}`,

      'comprehensive-gap': `You are analyzing 8 interconnected gap dimensions (primary sector, inclusion, data, trainers, placement, wages).

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate insight identifying:
1. Most severe gap dimension
2. Interconnected issues
3. Priority intervention

${existingInsight ? `Existing insight: "${existingInsight}"` : ''}

Return ONLY valid JSON.`,

      'primary-sector': `You are analyzing agricultural yield gaps and livelihood impact.

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate insight on:
1. Crops with highest yield gap × people impact
2. Training coverage gaps
3. Priority skill interventions

${existingInsight ? `Existing insight: "${existingInsight}"` : ''}

Return ONLY valid JSON.`,

      'training-funnel': `You are analyzing the training-to-placement conversion funnel.

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate insight on:
1. Biggest conversion drop points
2. Category-wise disparities (SC/ST/Women)
3. TP performance issues

${existingInsight ? `Existing insight: "${existingInsight}"` : ''}

Return ONLY valid JSON.`,

      'matrix': `You are analyzing the district skill maturity self-assessment matrix.

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate insight on:
1. Overall maturity level
2. Quick wins (critical + low score)
3. Strategic priorities

${existingInsight ? `Existing insight: "${existingInsight}"` : ''}

Return ONLY valid JSON.`,

      'annual-plan': `You are analyzing the annual work plan implementation status.

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate insight on:
1. Overall completion rate
2. Delayed tasks needing escalation
3. Department workload balance

${existingInsight ? `Existing insight: "${existingInsight}"` : ''}

Return ONLY valid JSON.`,

      'executive': `You are generating an executive summary from 5 critical visuals (youth pyramid, dropout, funnel, quality matrix, yield gap).

Key Metrics:
${JSON.stringify(metrics, null, 2)}

Generate a strategic insight covering:
1. Demographics (youth bulge)
2. Education leakage (dropouts)
3. Training quality (retention)
4. Sector priorities
5. Agriculture opportunity

${existingInsight ? `Existing insight: "${existingInsight}"` : ''}

Return ONLY valid JSON.`
    };

    return contextPrompts[context] || contextPrompts['as-is'];
  }

  private parseInsight(text: string): InsightResponse {
    // Clean markdown fences
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      return {
        headline: parsed.headline || '',
        keyMetrics: Array.isArray(parsed.keyMetrics) ? parsed.keyMetrics : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        urgentActions: Array.isArray(parsed.urgentActions) ? parsed.urgentActions : [],
        rawText: cleaned,
      };
    } catch (error) {
      console.error('JSON Parse Error:', error);
      return {
        headline: 'AI insight generation in progress...',
        keyMetrics: [],
        recommendations: [],
        urgentActions: [],
        rawText: text,
      };
    }
  }

  private getFallbackInsight(_context: string, metrics: DashboardMetrics): InsightResponse {
    return {
      headline: 'Insight generation temporarily unavailable',
      keyMetrics: Object.entries(metrics).slice(0, 2).map(([k, v]) => `${k}: ${v}`),
      recommendations: ['Review data manually for key trends'],
      urgentActions: [],
      rawText: JSON.stringify(metrics),
    };
  }

  /**
   * Clear cached insights (useful when data updates)
   */
  clearCache(context?: string) {
    if (context) {
      // Clear specific context
      for (const key of this.cache.keys()) {
        if (key.startsWith(context)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all
      this.cache.clear();
    }
  }
}

// Singleton instance
let aiInsightGenerator: AIInsightGenerator | null = null;

export function getAIInsightGenerator(): AIInsightGenerator {
  if (!aiInsightGenerator) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    aiInsightGenerator = new AIInsightGenerator(apiKey);
  }
  return aiInsightGenerator;
}

export type { InsightResponse, DashboardMetrics };
