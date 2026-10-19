import { describe, it, expect } from 'vitest';
import { readConsent, gtagConsentUpdate, CONSENT_DEFAULT } from '../../src/lib/consent';

describe('readConsent', () => {
  it('reads a stored choice', () => expect(readConsent({ getItem: () => 'granted' })).toBe('granted'));
  it('reads a refusal', () => expect(readConsent({ getItem: () => 'denied' })).toBe('denied'));
  it('treats junk as no choice', () => expect(readConsent({ getItem: () => 'weird' })).toBeNull());
  it('survives storage that throws', () =>
    expect(readConsent({ getItem: () => { throw new Error('blocked'); } })).toBeNull());
});

describe('gtag consent', () => {
  it('starts with everything denied', () =>
    expect(CONSENT_DEFAULT).toEqual({ analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 }));
  it('grants analytics only, never ads', () => {
    const [cmd, kind, state] = gtagConsentUpdate('granted');
    expect([cmd, kind]).toEqual(['consent', 'update']);
    expect(state).toEqual({ analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  });
});
