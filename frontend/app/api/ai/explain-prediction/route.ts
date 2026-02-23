/**
 * POST /api/ai/explain-prediction
 * Uses Groq to explain what the ML model did in plain English
 * for a non-technical village-level government member.
 */
import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'llama-3.3-70b-versatile';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { predictions } = body as { predictions: Prediction[] };

  if (!GROQ_API_KEY) {
    return NextResponse.json(mockExplanation(predictions));
  }

  const grouped = groupByRisk(predictions);

  const systemPrompt = `You are a friendly water management assistant for rural Maharashtra, India.
Your job is to explain AI drought predictions to non-technical government block officers and gram panchayat members.
Use simple, clear language. Avoid jargon. Speak as if talking to a village official who doesn't know what "LSTM" or "machine learning" means.
Respond ONLY with valid JSON. No markdown. No explanation outside JSON.`;

  const userPrompt = `The AI system just analyzed drought risk for ${predictions.length} districts in Maharashtra.

Here are the results:
CRITICAL risk (need urgent action): ${grouped.CRITICAL.map(p => `${p.district_name} (${Math.round(p.drought_prob * 100)}%)`).join(', ') || 'None'}
HIGH risk: ${grouped.HIGH.map(p => `${p.district_name} (${Math.round(p.drought_prob * 100)}%)`).join(', ') || 'None'}
MEDIUM risk: ${grouped.MEDIUM.map(p => `${p.district_name} (${Math.round(p.drought_prob * 100)}%)`).join(', ') || 'None'}
LOW risk: ${grouped.LOW.map(p => `${p.district_name} (${Math.round(p.drought_prob * 100)}%)`).join(', ') || 'None'}

The AI studied 30 days of rainfall, temperature, humidity, and groundwater data for each district.
Model accuracy: 99.78%  |  Run at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Generate a plain-English explanation for a block officer. Return this JSON:
{
  "headline": "One sentence headline of today's situation (friendly, not alarming)",
  "what_ai_did": "2-3 sentences explaining what the AI computer did, using simple words like 'studied past rainfall records' not 'LSTM inference'",
  "district_summaries": [
    {
      "district_name": "...",
      "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
      "drought_prob": 0.73,
      "plain_english": "One sentence in very simple language about this district's water risk",
      "what_to_do": "One specific action for a local officer to take today"
    }
  ],
  "overall_advice": "2 sentences of practical advice for the whole region today",
  "good_news": "One encouraging sentence if any districts are doing well (or general hope)",
  "next_run": "When will the AI check again (always say: tomorrow morning at 6 AM)"
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
        temperature: 0.4,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!groqRes.ok) {
      return NextResponse.json(mockExplanation(predictions));
    }

    const data    = await groqRes.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return NextResponse.json(mockExplanation(predictions));

    const parsed = JSON.parse(content);
    return NextResponse.json({ ...parsed, source: 'groq' });
  } catch {
    return NextResponse.json(mockExplanation(predictions));
  }
}

// ── Types ───────────────────────────────────────────────────────────────────
interface Prediction {
  district_id: number;
  district_name?: string;
  drought_prob: number;
  risk_level: string;
  predicted_at: string;
  horizon_days?: number;
}

function groupByRisk(predictions: Prediction[]) {
  const g: Record<string, Prediction[]> = { CRITICAL: [], HIGH: [], MEDIUM: [], LOW: [] };
  for (const p of predictions) g[p.risk_level]?.push(p);
  return g;
}

// ── Mock fallback ────────────────────────────────────────────────────────────
function mockExplanation(predictions: Prediction[]) {
  const critical = predictions.filter(p => p.risk_level === 'CRITICAL');
  const low      = predictions.filter(p => p.risk_level === 'LOW');

  return {
    source: 'mock',
    headline: critical.length > 0
      ? `⚠️ ${critical.length} district${critical.length > 1 ? 's need' : ' needs'} urgent water attention today`
      : '✅ Water situation is manageable across most districts today',
    what_ai_did: `Our computer system studied the last 30 days of rainfall, temperature, and groundwater levels for each district. It compared these patterns with thousands of past drought records to predict which areas are running low on water. This analysis runs every morning at 6 AM so officers always have fresh information.`,
    district_summaries: predictions.map(p => ({
      district_name: p.district_name ?? `District ${p.district_id}`,
      risk_level:    p.risk_level,
      drought_prob:  p.drought_prob,
      plain_english: p.risk_level === 'CRITICAL'
        ? `${p.district_name} is in serious trouble — water supplies may run out soon without action.`
        : p.risk_level === 'HIGH'
        ? `${p.district_name} is under stress — water needs careful monitoring this week.`
        : p.risk_level === 'MEDIUM'
        ? `${p.district_name} has some water concerns but is manageable with normal precautions.`
        : `${p.district_name} has good water availability — no action needed right now.`,
      what_to_do: p.risk_level === 'CRITICAL'
        ? 'Send water tankers immediately and issue conservation advisory to all villages.'
        : p.risk_level === 'HIGH'
        ? 'Check local reservoir levels and put tanker teams on standby.'
        : p.risk_level === 'MEDIUM'
        ? 'Monitor rainfall this week and advise farmers to conserve water.'
        : 'Normal operations — continue regular water supply schedule.',
    })),
    overall_advice: `Focus tanker resources on CRITICAL and HIGH risk districts first. Keep records of water distributed so the system can improve its predictions over time.`,
    good_news: low.length > 0
      ? `Good news: ${low.map(p => p.district_name).join(', ')} ${low.length === 1 ? 'is' : 'are'} doing well with water availability.`
      : `The AI model is 99.78% accurate — trust these alerts and act early to prevent water shortages.`,
    next_run: 'Tomorrow morning at 6 AM',
  };
}
