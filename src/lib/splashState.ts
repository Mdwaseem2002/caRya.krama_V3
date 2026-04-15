/**
 * This module manages the persistence of the splash screen state.
 * It uses sessionStorage to ensure the splash only shows once per browser session.
 */

const STORAGE_KEY = 'carya_splash_shown';

export const getSplashShown = (): boolean => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(STORAGE_KEY) === 'true';
};

export const setSplashShown = (value: boolean) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  }
};
