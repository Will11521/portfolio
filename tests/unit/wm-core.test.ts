import { describe, it, expect } from 'vitest';
import { clamp, bringToFront, extractWindow, windowIdForPath, isAppLink } from '../../src/lib/wm-core';

describe('clamp', () => {
  it('keeps 80px of the title bar on screen and stays below the menu bar', () => {
    expect(clamp({ x: -500, y: 0 }, { w: 400, h: 300 }, { w: 1280, h: 800 })).toEqual({ x: -320, y: 26 });
  });
  it('stops a window leaving the right and bottom edges', () => {
    expect(clamp({ x: 5000, y: 5000 }, { w: 400, h: 300 }, { w: 1280, h: 800 })).toEqual({ x: 1200, y: 772 });
  });
  it('leaves an in-bounds position alone', () => {
    expect(clamp({ x: 100, y: 120 }, { w: 400, h: 300 }, { w: 1280, h: 800 })).toEqual({ x: 100, y: 120 });
  });
});

describe('bringToFront', () => {
  it('moves the id to the end', () => expect(bringToFront(['a', 'b', 'c'], 'a')).toEqual(['b', 'c', 'a']));
  it('adds an id that was not open', () => expect(bringToFront(['a'], 'b')).toEqual(['a', 'b']));
});

describe('extractWindow', () => {
  const html = '<main><section data-window="mikey"><h2>M</h2></section></main>';
  it('returns the window element markup', () => expect(extractWindow(html, 'mikey')).toContain('data-window="mikey"'));
  it('returns null when the window is missing', () => expect(extractWindow(html, 'nope')).toBeNull());
});

describe('windowIdForPath', () => {
  it('maps the root to the Front Page', () => expect(windowIdForPath('/')).toBe('front'));
  it('maps a case study to project-<slug>', () => expect(windowIdForPath('/projects/mikey/')).toBe('project-mikey'));
  it('maps an app to its first segment', () => expect(windowIdForPath('/resume/')).toBe('resume'));
  it('ignores a trailing slash', () => expect(windowIdForPath('/projects/')).toBe('projects'));
});

describe('isAppLink', () => {
  const a = (href: string, attrs: Record<string, string> = {}) => {
    const el = document.createElement('a');
    el.href = href;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  };
  const origin = 'http://localhost:3000';
  it('accepts a same-origin page', () => expect(isAppLink(a('http://localhost:3000/projects'), origin)).toBe(true));
  it('rejects another site', () => expect(isAppLink(a('https://linkedin.com/x'), origin)).toBe(false));
  it('rejects downloads and new tabs', () => {
    expect(isAppLink(a('http://localhost:3000/x', { download: '' }), origin)).toBe(false);
    expect(isAppLink(a('http://localhost:3000/x', { target: '_blank' }), origin)).toBe(false);
  });
  it('rejects the recruiter read mode, files and mailto', () => {
    expect(isAppLink(a('http://localhost:3000/read'), origin)).toBe(false);
    expect(isAppLink(a('http://localhost:3000/images/a.jpg'), origin)).toBe(false);
    expect(isAppLink(a('mailto:x@y.z'), origin)).toBe(false);
  });
  it('rejects in-page anchors', () => expect(isAppLink(a('http://localhost:3000/#win'), origin)).toBe(false));
});
