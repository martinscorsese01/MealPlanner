import { NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(req: Request) {
  const body = await req.json();

  const prompt = `
You are a professional nutritionist. Create a 7-day meal plan for someone who follows a ${body.diet || 'balanced'} diet,
wants ${body.calories || 2000} calories per day,
is allergic to ${body.allergies || 'none'},
prefers ${body.cuisine || 'no specific'} cuisine,
and ${body.includeSnacks ? 'includes snacks' : 'no snacks'}.

Return it as JSON in this format:
{
  "Monday": {
    "Breakfast": "...",
    "Lunch": "...",
    "Dinner": "...",
    "Snacks": "..."
  },
  ...
}
Return only JSON.
  `;

  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  try {
    const raw = completion.choices[0].message?.content ?? '{}';
    const mealPlan = JSON.parse(raw);
    return NextResponse.json({ mealPlan });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
  }
}
