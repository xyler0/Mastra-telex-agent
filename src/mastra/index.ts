// index.ts
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { pitchWorkflow } from './workflows/pitch-workflow';
import { pitchAgent } from './agents/pitch-judge-agent';
import { completenessScorer, reasoningQualityScorer } from './scorers/pitch-scorers';
import { a2aAgentRoute } from './routes/a2a-agent-route'; 

export const mastra = new Mastra({
  workflows: { pitchWorkflow },
  agents: { pitchJudge: pitchAgent },
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
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true,
    },
    apiRoutes: [a2aAgentRoute],
  },
});