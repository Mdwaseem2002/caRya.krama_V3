/**
 * This module manages the persistence of the splash screen state.
 * Using an in-memory variable ensures the splash shows on every full page refresh
 * but remains hidden during internal single-page application navigation.
 */

let splashShown = false;

export const getSplashShown = (): boolean => {
  return splashShown;
};

export const setSplashShown = (value: boolean) => {
  splashShown = value;
};
