import { getMentorConfig, upsertMentorConfig } from '../../src/db/config';

// Mock getDb
const mockFindOne = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockCollection = jest.fn(() => ({ findOne: mockFindOne, findOneAndUpdate: mockFindOneAndUpdate }));
const mockDb = { collection: mockCollection } as any;

jest.mock('../../src/db/db', () => ({ getDb: () => mockDb }));

describe('db/config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getMentorConfig returns config data', async () => {
    mockFindOne.mockResolvedValueOnce({ key: 'mentor_config', data: { school_name: 'S', tone: 'T', rules: 'R' } });
    const cfg = await getMentorConfig();
    expect(cfg.school_name).toBe('S');
    expect(mockCollection).toHaveBeenCalledWith('configs');
  });

  test('getMentorConfig throws on missing', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    await expect(getMentorConfig()).rejects.toThrow(/introuvable/);
  });

  test('upsertMentorConfig upserts and returns doc', async () => {
    const fakeDoc = { key: 'mentor_config', data: { school_name: 'A' } } as any;
    mockFindOneAndUpdate.mockResolvedValueOnce(fakeDoc);
    const res = await upsertMentorConfig({ school_name: 'A', tone: 't', rules: 'r' } as any);
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    expect(res).toEqual(fakeDoc);
  });

  test('upsertMentorConfig throws if result invalid', async () => {
    mockFindOneAndUpdate.mockResolvedValueOnce({});
    await expect(upsertMentorConfig({ school_name: 'A', tone: 't', rules: 'r' } as any)).rejects.toThrow(/Impossible/);
  });
});
