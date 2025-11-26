import { getStudentSummary, createStudentSummary } from '../../src/db/summaries';

// Mock getDb and openai
const mockFindOne = jest.fn();
const mockUpdateOne = jest.fn();
const mockCollection = jest.fn(() => ({ findOne: mockFindOne, updateOne: mockUpdateOne }));
const mockDb = { collection: mockCollection } as any;

jest.mock('../../src/db/db', () => ({ getDb: () => mockDb }));

jest.mock('../../src/utils/prompts', () => ({ __esModule: true, default: (tpl: string, ctx: any) => `PREV:${ctx.previous_summary}` }));

// Mock openai from app
jest.mock('../../src/app', () => ({ openai: { responses: { create: jest.fn() } } }));

const { openai } = require('../../src/app');

describe('db/summaries', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getStudentSummary returns existing summary', async () => {
    mockFindOne.mockResolvedValueOnce({ email: 'a', summary: 'S' });
    const s = await getStudentSummary('a');
    expect(s).toBe('S');
  });

  test('getStudentSummary returns default string when none', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    const s = await getStudentSummary('a');
    expect(s).toContain('Aucun historique');
  });

  test('createStudentSummary calls openai and updates db', async () => {
    mockFindOne.mockResolvedValueOnce(null); // previous summary
    (openai.responses.create as jest.Mock).mockResolvedValueOnce({ output_text: ' new summary ' });

    await createStudentSummary('tpl', 'a@b', 'hi', 'reply');

    expect(openai.responses.create).toHaveBeenCalled();
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { email: 'a@b' },
      expect.objectContaining({ $set: expect.any(Object) }),
      { upsert: true }
    );
  });

  test('createStudentSummary handles openai error gracefully', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    (openai.responses.create as jest.Mock).mockRejectedValueOnce(new Error('err'));
    await createStudentSummary('tpl', 'a@b', 'hi', 'reply');
    // shouldn't throw, but updateOne not called
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });
});
