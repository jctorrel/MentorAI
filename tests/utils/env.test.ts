import getEnv from '../../src/utils/env';

describe('getEnv', () => {
  const KEY = 'TEST_ENV_KEY';

  afterEach(() => {
    delete process.env[KEY];
  });

  test('returns env value when present', () => {
    process.env[KEY] = 'value123';
    expect(getEnv(KEY)).toBe('value123');
  });

  test('returns fallback when not present', () => {
    delete process.env[KEY];
    expect(getEnv(KEY, 'fallback')).toBe('fallback');
  });

  test('throws when missing and no fallback', () => {
    delete process.env[KEY];
    expect(() => getEnv(KEY)).toThrow(/Missing env var/);
  });
});
