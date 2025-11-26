// Mock env and other dependencies before importing buildApp
jest.mock('../src/utils/env', () => ({ __esModule: true, default: (k: string) => 'x' }));

// Mock Mongo and Db functions
jest.mock('../src/db/db', () => ({ initMongo: jest.fn().mockResolvedValue({}), getDb: jest.fn() }));

jest.mock('../src/db/config', () => ({ getMentorConfig: jest.fn().mockResolvedValue({ school_name: 'S', tone: 'T', rules: 'R' }) }));
jest.mock('../src/db/programs', () => ({ getProgramsMap: jest.fn().mockResolvedValue({}) }));
jest.mock('../src/db/prompts', () => ({ getPromptContent: jest.fn().mockResolvedValue('MENTOR') }));

jest.mock('../src/routes/index', () => ({ __esModule: true, default: (_deps: any) => (req: any, res: any) => res.end() }));

import buildApp, { openai } from '../src/app';

describe('buildApp', () => {
  test('returns express app when deps present', async () => {
    const app = await buildApp();
    expect(app).toBeDefined();
  });
});
