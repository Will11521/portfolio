import { describe, it, expect } from 'vitest';
import { runCommand, complete } from '../../src/lib/terminal';

const home = { cwd: '~' };

describe('terminal', () => {
  it('whoami names him and his title', () => expect(runCommand('whoami', home).out[0]).toContain('business systems analyst'));
  it('help lists the commands', () => {
    const help = runCommand('help', home).out.join('\n');
    for (const c of ['whoami', 'ls', 'cd', 'open', 'cat', 'ask', 'theme', 'contact']) expect(help).toContain(c);
  });
  it('ls shows the apps', () => expect(runCommand('ls', home).out[0]).toBe('projects/  resume  contact  now  mikey  back-issues'));
  it('ls projects lists case studies', () => expect(runCommand('ls projects', home).out.join(' ')).toContain('erp-integration'));
  it('open projects opens the window', () => expect(runCommand('open projects', home).open).toBe('/projects'));
  it('open a project by slug', () => expect(runCommand('open mikey', home).open).toBe('/mikey'));
  it('cd into projects then open a case', () => {
    const cd = runCommand('cd projects', home);
    expect(cd.cwd).toBe('~/projects');
    expect(runCommand('open wyngaarden', { cwd: '~/projects' }).open).toBe('/projects/wyngaarden');
  });
  it('theme switches the wallpaper', () => expect(runCommand('theme night', home).theme).toBe('night'));
  it('rejects an unknown theme', () => expect(runCommand('theme pink', home).out[0]).toMatch(/sunset, paper or night/));
  it('ask routes through Mikey', () => expect(runCommand('ask how do i contact him', home).open).toBe('/contact'));
  it('cat resume prints the current role', () => expect(runCommand('cat resume', home).out.join('\n')).toContain('Business Systems Analyst — The Kara Consultancy'));
  it('clear clears', () => expect(runCommand('clear', home).clear).toBe(true));
  it('sudo is refused politely', () => expect(runCommand('sudo rm -rf /', home).out[0]).toMatch(/nice try/i));
  it('unknown commands say so', () => expect(runCommand('rm -rf /', home).out[0]).toBe('command not found: rm — try help'));
  it('blank input prints nothing', () => expect(runCommand('   ', home).out).toEqual([]));
});

describe('complete', () => {
  it('completes a unique prefix', () => expect(complete('th')).toEqual(['theme']));
  it('lists every match', () => expect(complete('c')).toEqual(['cat', 'cd', 'clear', 'contact']));
  it('completes arguments', () => expect(complete('open pro')).toEqual(['open projects']));
});
