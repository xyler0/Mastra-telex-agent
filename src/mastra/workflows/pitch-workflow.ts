import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { pitchEvaluatorTool } from "../tools/evaluate-pitch-tool";

const evaluateStep = createStep({
  id: "evaluate-pitch",
  description: "Scores the startup pitch using Gemini",
  inputSchema: z.object({
    pitch: z.string().min(20),
  }),
  outputSchema: z.object({
    evaluation: z.string(),
  }),
  execute: async ({ inputData, runtimeContext }) => {
    const result = await pitchEvaluatorTool.execute({
      context: { pitch: inputData.pitch },
      runtimeContext,
    });
    return result;
  },
});

export const pitchWorkflow = createWorkflow({
  id: "pitch-workflow",
  inputSchema: z.object({
    pitch: z.string().min(20),
  }),
  outputSchema: z.object({
    evaluation: z.string(),
  }),
})
  .then(evaluateStep)
  .commit();
