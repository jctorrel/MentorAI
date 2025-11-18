import { loadPrompt, render } from '../../src/utils/prompts';

describe('prompts utilities', () => {
  test('loadPrompt returns file contents for existing prompt', () => {
    const content = loadPrompt('mentor-system.txt');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    expect(content).toMatch(/Tu es le mentor/);
  });

  test('loadPrompt returns empty string for missing prompt', () => {
    const content = loadPrompt('this-file-does-not-exist.txt');
    expect(content).toBe('');
  });

  test('render replaces template variables and leaves unknown empty', () => {
    const template = 'Hello {{name}}, your email is {{email}} and missing {{missing}}.';
    const out = render(template, { name: 'Alice', email: 'a@x.com' } as any);
    expect(out).toContain('Alice');
    expect(out).toContain('a@x.com');
    expect(out).toContain('missing .');
  });
});
