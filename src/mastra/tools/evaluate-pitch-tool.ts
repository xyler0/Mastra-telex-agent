import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const pitchEvaluatorTool = createTool({
  id: 'evaluate-pitch',
  description: 'Evaluates startup pitches based on clarity, innovation, and market potential.',
  inputSchema: z.object({
    pitch: z.string().describe('Startup pitch text to evaluate'),
  }),
  outputSchema: z.object({
    clarity: z.number(),
    problemDefinition: z.number(),
    solutionInnovation: z.number(),
    marketPotential: z.number(),
    feasibility: z.number(),
    teamStrength: z.number(),
    wowFactor: z.number(),
    overall_score: z.number(),
    summary: z.string(),
  }),
  execute: async ({ context }) => {
    const { pitch } = context;
    if (!pitch) throw new Error('Pitch text missing');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
You are an AI pitch evaluator. Analyze the following startup pitch and rate it
from 1–10 on these criteria:
- Clarity
- Problem Definition
- Solution & Innovation
- Market Potential
- Feasibility / Execution
- Team Strength
- Wow Factor / Creativity

Return **JSON only** with numeric scores, overall_score (0–100), and a short feedback summary.
Pitch:
${pitch}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return safeParse(text);
  },
});

function safeParse(txt: string) {
  try {
    return JSON.parse(txt);
  } catch {
    const match = txt.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { error: 'Invalid JSON', raw: txt };
  }
}
