import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
// src/mastra/workflows/pitch-workflow.ts
import { pitchEvaluatorTool } from '../tools/evaluate-pitch-tool';

const evaluateStep = createStep({
  id: "evaluate-pitch",
  description: "Scores the startup pitch using Gemini",
  inputSchema: z.object({
    pitch: z.string().min(20),
  }),
  outputSchema: pitchEvaluatorTool.outputSchema,
  execute: async ({ inputData, runtimeContext }) => {
    const result = await pitchEvaluatorTool.execute({
      context: { pitch: inputData.pitch },
      runtimeContext,
    });
    return result; // must match outputSchema
  },
});

export const pitchWorkflow = createWorkflow({
  id: "pitch-workflow",
  inputSchema: z.object({
    pitch: z.string().min(20).describe("The startup pitch"),
  }),
  outputSchema: pitchEvaluatorTool.outputSchema, // match step output
})
  .then(evaluateStep)
  .commit();
