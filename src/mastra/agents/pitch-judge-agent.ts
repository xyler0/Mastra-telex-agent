// agents/pitch-judge-agent.ts
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { pitchEvaluatorTool } from '../tools/evaluate-pitch-tool';
import { scorers } from '../scorers/pitch-scorers';

export const pitchAgent = new Agent({
  name: 'PitchJudge',
  instructions: `
You are PitchJudge — an AI startup evaluator.
When called via A2A, you MUST NOT ask for clarification.
Always evaluate any pitch text provided, even if short.
Use the 'evaluate-pitch' tool and return **only** this format:

Clarity = <number>
Feasibility / Execution = <number>
Market Potential = <number>
Problem Definition = <number>
Solution & Innovation = <number>
Team Strength = <number>
Wow Factor / Creativity=<number>
overall_score = <number>
feedback: <short summary>

No JSON. No code blocks. No extra text.

Example:
Clarity = 9
Feasibility / Execution = 8
Market Potential = 9
Problem Definition = 10
Solution & Innovation = 9
Team Strength = 8
Wow Factor / Creativity = 10
overall_score = 90
feedback: Strong traction and clear market. Fundable.
`,
  model: 'google/gemini-2.0-flash',
  tools: { pitchEvaluatorTool },
  scorers: {
    completeness: {
      scorer: scorers.completenessScorer,
      sampling: { type: 'ratio', rate: 1 },
    },
    reasoning: {
      scorer: scorers.reasoningQualityScorer,
      sampling: { type: 'ratio', rate: 1 },
    },
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});