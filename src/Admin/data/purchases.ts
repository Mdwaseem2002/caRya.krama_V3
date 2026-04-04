const PURCHASE_KEY = 'user_purchases_db';

export const getPurchases = (): string[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PURCHASE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addPurchase = (carId: string) => {
  const purchases = getPurchases();
  if (!purchases.includes(carId)) {
    purchases.push(carId);
    localStorage.setItem(PURCHASE_KEY, JSON.stringify(purchases));
  }
};

export const hasPurchased = (carId: string): boolean => {
  return getPurchases().includes(carId);
};
