import { logger } from '../../src/utils/logger';

describe('logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('info logs with ℹ️', () => {
    (console.log as jest.Mock).mockClear();
    logger.info('test');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('ℹ️'));
  });

  test('warn logs with ⚠️', () => {
    (console.warn as jest.Mock).mockClear();
    logger.warn('test');
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('⚠️'));
  });

  test('error logs with ❌ and optional arg', () => {
    (console.error as jest.Mock).mockClear();
    logger.error('oops');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('❌'), '');

    (console.error as jest.Mock).mockClear();
    logger.error('oops2', { a: 1 });
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('❌'), { a: 1 });
  });
});
