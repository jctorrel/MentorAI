import loadConfig from '../../src/utils/configs';

describe('loadConfig', () => {
  test('loads mentor-config.json and returns object', () => {
    const cfg = loadConfig('mentor-config.json');
    expect(cfg).toBeDefined();
    expect(cfg.school_name).toBe('Normandie Web School');
  });

  test('returns empty object for missing config file', () => {
    const cfg = loadConfig('no-such-config.json');
    expect(cfg).toBeDefined();
    expect(typeof cfg).toBe('object');
  });
});
