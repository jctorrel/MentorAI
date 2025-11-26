jest.mock('../../src/utils/env', () => ({ __esModule: true, default: (key: string) => {
  if (key === 'PROGRAMS_PROMPT_TEMPLATE') return 'programs-system.txt';
  return '';
}}));

jest.mock('../../src/db/prompts', () => ({
  getPromptContent: jest.fn().mockResolvedValue('PROGRAM TEMPLATE: {{program_label}} - {{program_modules}}'),
}));

jest.mock('../../src/utils/prompts', () => ({ __esModule: true, default: jest.fn((tpl: string, ctx: any) => `RENDERED: ${ctx.program_label} | ${ctx.program_modules}`) }));

import { getActiveModules, getProgramPrompt } from '../../src/utils/programs';
import { getPromptContent } from '../../src/db/prompts';
import render from '../../src/utils/prompts';

describe('programs utils', () => {
  const programs = {
    A1: {
      objectives: 'OBJ',
      level: 'A1',
      label: 'Programme A1',
      resources: ['R1'],
      modules: [
        { id: 'm1', label: 'Mod 1', start_month: 1, end_month: 3, content: ['c1'] },
        { id: 'm2', label: 'Mod 2', start_month: 11, end_month: 2, content: ['c2'] },
      ],
    },
  } as any;

  test('getActiveModules normal range', () => {
    const date = new Date('2021-02-15'); // Feb (2)
    const active = getActiveModules(programs, 'A1', date);
    // With cross-year module (11 -> 2) it should be active in Feb too
    expect(active.map(a => a.id)).toEqual(['m1', 'm2']);
  });

  test('getActiveModules cross-year range', () => {
    const date = new Date('2021-12-05'); // Dec (12) — should include module 2 since 11 -> 2
    const active = getActiveModules(programs, 'A1', date);
    expect(active.map(a => a.id)).toEqual(['m2']);
  });

  test('getProgramPrompt renders and reads prompt template', async () => {
    const date = new Date('2021-12-05');
    const out = await getProgramPrompt(programs as any, 'A1', date);
    expect(getPromptContent).toHaveBeenCalledWith('programs-system.txt');
    expect(render).toHaveBeenCalled();
    expect(out).toContain('RENDERED: Programme A1');
  });

  test('getProgramPrompt throws when no template', async () => {
    (getPromptContent as jest.Mock).mockResolvedValueOnce(null);
    await expect(getProgramPrompt(programs as any, 'A1')).rejects.toThrow(/Prompt programme introuvable/);
  });
});
