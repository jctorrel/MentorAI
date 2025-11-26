import { shutdown } from '../../src/utils/shutdown';

jest.mock('../../src/utils/logger', () => ({
  logger: {
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('../../src/db/db', () => ({
  closeMongo: jest.fn().mockResolvedValue(undefined),
}));

const { logger } = require('../../src/utils/logger');
const { closeMongo } = require('../../src/db/db');

describe('shutdown util', () => {
  const origExit = process.exit;

  beforeEach(() => {
    jest.useFakeTimers();
    (process.exit as any) = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    process.exit = origExit;
    jest.clearAllMocks();
  });

  test('calls closeMongo and server.close, exits 0', async () => {
    const server = { close: jest.fn((cb) => cb()) } as any;

    await shutdown('SIGINT', server);

    expect(logger.warn).toHaveBeenCalled();
    expect(closeMongo).toHaveBeenCalled();
    expect(server.close).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  test('sets a fail-safe timeout that calls exit 1', async () => {
    const server = { close: jest.fn(() => {}) } as any;
    // switch to real timers to capture setTimeout behavior
    jest.useRealTimers();
    const timers: any[] = [];
    const origSetTimeout = global.setTimeout;
    (global as any).setTimeout = ((fn: any, ms?: number) => {
      timers.push({ fn, ms });
      return { unref: () => {} } as any;
    }) as any;

    // re-require the module so it picks the overridden setTimeout
    jest.resetModules();
    const { shutdown: freshShutdown } = require('../../src/utils/shutdown');
    await freshShutdown('SIGTERM', server);

    // Simulate the timeout callback manually
    expect(timers.length).toBeGreaterThan(0);
    timers.forEach((t) => t.fn());

    expect(process.exit).toHaveBeenCalledWith(1);
    (global as any).setTimeout = origSetTimeout;
  });
});
