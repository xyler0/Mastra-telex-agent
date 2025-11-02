import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { pitchEvaluatorTool } from '../tools/evaluate-pitch-tool';
import { scorers } from '../scorers/pitch-scorers';

export const pitchAgent = new Agent({
  name: 'PitchJudge',
  instructions: `
You are an AI startup pitch judge. Your purpose is to analyze startup ideas
and assign detailed quantitative scores across multiple criteria:
- Clarity of presentation
- Problem definition
- Solution innovation
- Market potential
- Feasibility
- Team strength
- Wow factor / creativity

You must respond in structured JSON format when evaluating a pitch. Do not return explanations outside JSON.
If unclear, request clarification from user.

Use the 'evaluate-pitch' tool to perform analysis and scoring.
`,
  model: 'google/gemini-2.5-flash',
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
