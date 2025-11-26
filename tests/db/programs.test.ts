import { getProgramById, getProgramsMap, listPrograms, upsertProgram, upsertProgramsFromObject } from '../../src/db/programs';

const mockFindOne = jest.fn();
const mockFind = jest.fn(() => ({ sort: jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([]) })) }));
const mockFindOneAndUpdate = jest.fn();
const mockCollection = jest.fn(() => ({ findOne: mockFindOne, find: mockFind, findOneAndUpdate: mockFindOneAndUpdate }));
const mockDb = { collection: mockCollection } as any;

jest.mock('../../src/db/db', () => ({ getDb: () => mockDb }));

describe('db/programs', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getProgramById returns program', async () => {
    const p = { id: 'p1', label: 'P1' } as any;
    mockFindOne.mockResolvedValueOnce(p);
    const got = await getProgramById('p1');
    expect(got).toEqual(p);
  });

  test('getProgramsMap maps values', async () => {
    const arr = [{ id: 'p1' }, { id: 'p2' }];
    (mockFind as any).mockReturnValueOnce({ toArray: jest.fn().mockResolvedValueOnce(arr) });
    const map = await getProgramsMap();
    expect(map.p1).toBeDefined();
    expect(map.p2).toBeDefined();
  });

  test('listPrograms returns array', async () => {
    (mockFind as any).mockReturnValueOnce({ sort: () => ({ toArray: jest.fn().mockResolvedValueOnce([{ id: 'p' }]) }) });
    const list = await listPrograms();
    expect(list).toEqual([{ id: 'p' }]);
  });

  test('upsertProgram returns program', async () => {
    const p = { id: 'p1', label: 'P1' } as any;
    mockFindOneAndUpdate.mockResolvedValueOnce(p);
    const res = await upsertProgram('p1', { label: 'P1', objectives: 'o', level: 'l', resources: [], modules: [] } as any);
    expect(res).toEqual(p);
  });

  test('upsertProgram throws when result invalid', async () => {
    mockFindOneAndUpdate.mockResolvedValueOnce({});
    await expect(upsertProgram('p1', { label: 'P1', objectives: '', level: '', resources: [], modules: [] } as any)).rejects.toThrow(/Échec upsert/);
  });

  test('upsertProgramsFromObject inserts objects', async () => {
    mockFindOneAndUpdate.mockResolvedValue({ id: 'p1' });
    const obj = { p1: { label: 'P1', objectives: 'o', level: 'l', resources: [], modules: [] } };
    await upsertProgramsFromObject(obj as any);
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
  });
});
