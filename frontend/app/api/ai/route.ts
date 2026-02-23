/**
 * POST /api/ai
 * Next.js server route for Groq AI analysis of drought risk data.
 * Uses Groq's llama-3.3-70b-versatile for fast inference.
 */
import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'llama-3.3-70b-versatile';

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY) {
    // Return smart mock data when key isn't set – useful for demo without key
    return NextResponse.json(mockInsights());
  }

  const body = await req.json();
  const { districts, tankers, context } = body;

  const systemPrompt = `You are AquaGov's AI drought analyst for Maharashtra, India.
Your job is to analyze real-time drought risk data and generate:
1. A 30-day VWSI (Village Water Stress Index) forecast narrative
2. Key risk factors with severity ratings
3. Actionable recommendations for district water officers
4. SMS message templates for farmer alerts

Respond ONLY with valid JSON matching the schema provided. No markdown, no explanation.`;

  const userPrompt = `Analyze the following live drought data for Maharashtra districts:

DISTRICTS: ${JSON.stringify(districts?.slice(0, 10) ?? [])}
TANKER FLEET: ${JSON.stringify({ total: tankers?.length ?? 24, active: tankers?.filter((t: {status: string}) => t.status === 'active').length ?? 18 })}
CONTEXT: ${context ?? 'Daily drought risk analysis requested.'}

Return JSON with this exact structure:
{
  "summary": "2-sentence executive summary of current drought situation",
  "risk_factors": [
    { "name": "Rainfall Deficit", "value": "-42% vs normal", "severity": "high", "detail": "..." },
    { "name": "Soil Moisture",    "value": "18% avg",         "severity": "medium", "detail": "..." },
    { "name": "Temp Anomaly",     "value": "+2.4°C avg",      "severity": "high", "detail": "..." }
  ],
  "forecast": {
    "trend": "increasing | decreasing | stable",
    "peak_day": 25,
    "peak_vwsi": 0.78,
    "narrative": "2-sentence forecast narrative"
  },
  "recommendations": [
    {
      "title": "...",
      "detail": "...",
      "action": "...",
      "urgency": "critical | high | medium",
      "tankers_required": 4
    }
  ],
  "sms_template": "140-char SMS message for farmers in most at-risk district",
  "critical_districts": ["name1", "name2"],
  "model_confidence": 0.87
}`;

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('Groq API error:', err);
      return NextResponse.json(mockInsights(), { status: 200 });
    }

    const groqData = await groqRes.json();
    const content  = groqData.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json(mockInsights());

    const parsed = JSON.parse(content);
    return NextResponse.json({ ...parsed, source: 'groq', model: MODEL });

  } catch (err) {
    console.error('Groq route error:', err);
    return NextResponse.json(mockInsights());
  }
}

// ── Mock fallback (used when GROQ_API_KEY not set) ────────────────────────────
function mockInsights() {
  return {
    source: 'mock',
    model: 'heuristic-fallback',
    summary: 'Solapur and Latur districts are at CRITICAL drought risk with VWSI above 0.70. Immediate tanker reallocation and farmer advisories are recommended for the next 7 days.',
    risk_factors: [
      { name: 'Rainfall Deficit', value: '-42% vs normal', severity: 'high',   detail: 'Monsoon delayed by 14 days in eastern talukas, causing acute deficit.' },
      { name: 'Soil Moisture',    value: '18% avg',         severity: 'medium', detail: 'Rapid topsoil depletion across 45 villages; critical threshold is 15%.' },
      { name: 'Temp Anomaly',     value: '+2.4°C avg',      severity: 'high',   detail: 'Extended heatwave expected next week, accelerating evaporation.' },
    ],
    forecast: {
      trend:     'increasing',
      peak_day:  25,
      peak_vwsi: 0.78,
      narrative: 'VWSI is projected to peak at 0.78 in 25 days if no rainfall occurs. Early monsoon arrival could reduce risk to HIGH by end of month.',
    },
    recommendations: [
      {
        title:             'Increase Tanker Allocation',
        detail:            'Khamgaon and Selu clusters are predicted to cross critical VWSI threshold (0.60) in 5 days.',
        action:            'Approve Allocation',
        urgency:           'critical',
        tankers_required:  4,
      },
      {
        title:             'Send Conservation Advisory',
        detail:            'Heatwave predicted. Advise farmers in eastern talukas to delay sowing by 1 week.',
        action:            'Draft SMS',
        urgency:           'high',
        tankers_required:  0,
      },
      {
        title:             'Prepare Emergency Reservoir',
        detail:            'Current depletion rate suggests primary reservoir will hit dead storage in 18 days.',
        action:            'View Plan',
        urgency:           'medium',
        tankers_required:  0,
      },
    ],
    sms_template: '⚠ DROUGHT ALERT [CRITICAL]: Solapur shows 73% risk. Water conservation advised. Delay sowing. - AquaGov',
    critical_districts: ['Solapur', 'Latur'],
    model_confidence: 0.85,
  };
}
