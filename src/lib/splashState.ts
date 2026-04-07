// This module-level variable persists as long as the application is running (internal navigation)
// but resets whenever the page is hard-refreshed (browser restart/reload).
let hasShownSplash = false;

export const getSplashShown = () => hasShownSplash;
export const setSplashShown = (value: boolean) => {
  hasShownSplash = value;
};
