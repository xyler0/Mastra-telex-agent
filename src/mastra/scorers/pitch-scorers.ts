import { createCompletenessScorer } from '@mastra/evals/scorers/code';
import { createScorer } from '@mastra/core/scores';
import { z } from 'zod';

export const completenessScorer = createCompletenessScorer();

export const reasoningQualityScorer = createScorer({
  name: 'Reasoning Quality',
  description: 'Evaluates the depth, consistency, and balance of AI reasoning in scoring the pitch.',
  type: 'agent',
  judge: {
    model: 'google/gemini-2.0-flash',
    instructions:
      'Assess whether the assistant provided a coherent, balanced reasoning for the pitch evaluation. Return JSON with numeric quality score.',
  },
})
  .preprocess(({ run }) => {
    const text = run.output?.[0]?.content as string;
    return { text };
  })
  .analyze({
    description: 'Analyze pitch feedback for clarity and reasoning consistency.',
    outputSchema: z.object({
      reasoning_score: z.number().min(0).max(10),
      explanation: z.string(),
    }),
    createPrompt: ({ results }) => `
Evaluate this pitch feedback quality:
"""
${results.preprocessStepResult.text}
"""
Return:
{
  "reasoning_score": number,
  "explanation": string
}
    `,
  })
  .generateScore(({ results }) => {
    const r = (results as any)?.analyzeStepResult || {};
    return Math.min(1, (r.reasoning_score ?? 0) / 10);
  })
  .generateReason(({ results, score }) => {
    const r = (results as any)?.analyzeStepResult || {};
    return `Reasoning quality: ${r.reasoning_score}/10. Explanation: ${r.explanation}. Normalized score: ${score}.`;
  });

export const scorers = {
  completenessScorer,
  reasoningQualityScorer,
};
