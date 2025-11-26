import { getPromptContent, getPrompt, listPrompts, upsertPrompt, deletePrompt } from '../../src/db/prompts';

const mockFindOne = jest.fn();
const mockFind = jest.fn(() => ({ sort: jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([]) })) }));
const mockFindOneAndUpdate = jest.fn();
const mockDeleteOne = jest.fn();
const mockCollection = jest.fn(() => ({ findOne: mockFindOne, find: mockFind, findOneAndUpdate: mockFindOneAndUpdate, deleteOne: mockDeleteOne }));
const mockDb = { collection: mockCollection } as any;

jest.mock('../../src/db/db', () => ({ getDb: () => mockDb }));

describe('db/prompts', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getPromptContent returns content when found', async () => {
    mockFindOne.mockResolvedValueOnce({ content: 'X' });
    const c = await getPromptContent('k');
    expect(c).toBe('X');
  });

  test('getPromptContent returns null when not found', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    const c = await getPromptContent('k');
    expect(c).toBeNull();
  });

  test('getPrompt returns full doc', async () => {
    const doc = { key: 'k', content: 'X' } as any;
    mockFindOne.mockResolvedValueOnce(doc);
    const d = await getPrompt('k');
    expect(d).toBe(doc);
  });

  test('listPrompts returns array', async () => {
    (mockFind as any).mockReturnValueOnce({ sort: () => ({ toArray: jest.fn().mockResolvedValueOnce([{ key: 'k' }]) }) });
    const list = await listPrompts();
    expect(list).toEqual([{ key: 'k' }]);
  });

  test('upsertPrompt upserts and returns doc', async () => {
    const doc = { key: 'k' } as any;
    mockFindOneAndUpdate.mockResolvedValueOnce(doc);
    const out = await upsertPrompt('k', 'c', { label: 'L' });
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    expect(out).toBe(doc);
  });

  test('upsertPrompt throws on invalid result', async () => {
    mockFindOneAndUpdate.mockResolvedValueOnce({});
    await expect(upsertPrompt('k', 'c')).rejects.toThrow(/Impossible de créer/);
  });

  test('deletePrompt calls deleteOne', async () => {
    await deletePrompt('k');
    expect(mockDeleteOne).toHaveBeenCalledWith({ key: 'k' });
  });
});
