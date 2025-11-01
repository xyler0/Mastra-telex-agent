import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { pitchWorkflow } from './workflows/pitch-workflow';
import { pitchAgent } from './agents/pitch-judge-agent';
import { completenessScorer, reasoningQualityScorer } from './scorers/pitch-scorers';

export const mastra = new Mastra({
  workflows: { pitchWorkflow },
  agents: { pitchAgent },
  scorers: { completenessScorer, reasoningQualityScorer },
  storage: new LibSQLStore({
    url: ':memory:',
  }),
  logger: new PinoLogger({
    name: 'PitchJudge',
    level: 'info',
  }),
  observability: {
    default: { enabled: true },
  },
});
