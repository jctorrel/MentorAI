
jest.mock('../../src/utils/logger', () => ({ logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() } }));

// Mock mongodb's MongoClient
const createIndexFn = jest.fn().mockResolvedValue(undefined);
const mockCollection = () => ({ createIndex: createIndexFn });

const mockDb = {
  collection: jest.fn((name: string) => mockCollection()),
  dbName: 'test',
} as any;

const connectFn = jest.fn().mockResolvedValue(undefined);

const mockClient = {
  connect: connectFn,
  db: jest.fn(() => mockDb),
  close: jest.fn().mockResolvedValue(undefined),
} as any;

jest.mock('mongodb', () => ({ MongoClient: jest.fn(() => mockClient) }));

import { initMongo, getDb, closeMongo } from '../../src/db/db';

describe('db/index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // reset modules so initMongo module-level variables are reset
    jest.resetModules();
  });

  test('getDb throws if not initialized', () => {
    const dbModule = require('../../src/db/db');
    expect(() => dbModule.getDb()).toThrow(/Mongo non initialisé/);
  });

  test('initMongo sets up client and db and creates indexes', async () => {
    const res = await initMongo('mongodb://localhost:27017', 'testdb');
    expect(connectFn).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('testdb');
    expect(createIndexFn).toHaveBeenCalled();

    // subsequent call returns cached client/db
    const res2 = await initMongo('mongodb://localhost:27017', 'testdb');
    expect(res2.client).toBe(res.client);
  });

  test('closeMongo calls client.close', async () => {
    await initMongo('mongodb://localhost:27017', 'testdb');
    await closeMongo();
    expect(mockClient.close).toHaveBeenCalled();
  });
});
