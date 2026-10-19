export type Consent = 'granted' | 'denied' | null;

export const CONSENT_KEY = 'wos-consent';
export const GA_ID = 'G-3SK3ZCW6JM';

export const CONSENT_DEFAULT = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
} as const;

/** The visitor's stored choice, or null if none (or storage is unavailable). */
export function readConsent(store: Pick<Storage, 'getItem'>): Consent {
  try {
    const v = store.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/** The gtag call for a choice. Ads are always denied: this site never runs ads. */
export function gtagConsentUpdate(c: 'granted' | 'denied') {
  return [
    'consent',
    'update',
    { analytics_storage: c, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
  ] as ['consent', 'update', { analytics_storage: string; ad_storage: 'denied'; ad_user_data: 'denied'; ad_personalization: 'denied' }];
}
