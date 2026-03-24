import { useEffect } from 'react';

export function ManifestGenerator() {
  useEffect(() => {
    document.querySelector('link[rel="manifest"]')?.remove();
  }, []);

  return null;
}
