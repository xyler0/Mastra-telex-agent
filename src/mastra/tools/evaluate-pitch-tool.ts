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
  // Output as plain text — not JSON
  outputSchema: z.object({
    evaluation: z.string(),
  }),
  execute: async ({ context }) => {
    const { pitch } = context;
    if (!pitch) throw new Error('Pitch text missing');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
You are an AI startup pitch evaluator.
Evaluate the following pitch and respond ONLY in this strict format:

Clarity = <number>
Feasibility / Execution = <number>
Market Potential = <number>
Problem Definition = <number>
Solution & Innovation = <number>
Team Strength = <number>
Wow Factor / Creativity = <number>
overall_score = <number>
feedback: <short summary>

No JSON, no code blocks, no explanation text.

Pitch:
${pitch}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return { evaluation: text };
  },
});
