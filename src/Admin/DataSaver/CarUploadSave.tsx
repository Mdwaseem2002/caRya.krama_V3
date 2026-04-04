"use client";

// Mock Backend: CarUploadSave.tsx
// Temporary store using localStorage until cloud DB is connected

export interface CarMedia {
  images: string[];
  coverImage: string;
}

export interface CarPricing {
  actualPrice: string;
  sellingPrice: string;
  savings: string;
}

export interface CarSpecs {
  mileage: string;
  fuelType: string;
  transmission: string;
  ownership: string;
  color: string;
}

export interface InspectionPoint {
  title: string;
  value: string;
  highlight?: boolean;
}

export interface CarCondition {
  conditionLabel: string; // Excellent / Very Good / Good
  score: string;
  highlights: string[];
  inspectionPoints: InspectionPoint[];
}

export interface CarLocation {
  area: string;
  city: string;
}

export interface CarData {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: string;
  media: CarMedia;
  pricing: CarPricing;
  specs: CarSpecs;
  condition: CarCondition;
  location: CarLocation;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
}

const STORAGE_KEY = "carya_cars_db";

export const saveCar = (car: Omit<CarData, "id" | "createdAt">): CarData => {
  const existingCars = getAllCars();
  
  const newCar: CarData = {
    ...car,
    id: `CK-${Math.floor(Math.random() * 10000000).toString()}`,
    createdAt: new Date().toISOString(),
  };

  const tryStore = (carsToStore: CarData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carsToStore));
    } catch (e: any) {
      if (e?.name === "QuotaExceededError" || e?.code === 22) {
        // Step 1: Strip images from the oldest cars to free space
        const stripped = carsToStore.map((c, i) => 
          i > 0 ? { ...c, media: { images: [], coverImage: "" } } : c
        );
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
        } catch {
          // Step 2: Nuclear option — clear everything and save just the new car
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([carsToStore[0]]));
        }
      }
    }
  };

  tryStore([newCar, ...existingCars]);
  return newCar;
};

export const getAllCars = (): CarData[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPublishedCars = (): CarData[] => {
  return getAllCars().filter((car) => car.status === 'published');
};

export const updateCar = (id: string, updates: Omit<CarData, "id" | "createdAt">): CarData | null => {
  const cars = getAllCars();
  const index = cars.findIndex(c => c.id === id);
  if (index === -1) return null;
  const updatedCar: CarData = { ...cars[index], ...updates, id: cars[index].id, createdAt: cars[index].createdAt };
  cars[index] = updatedCar;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  return updatedCar;
};

export const deleteCar = (id: string) => {
  const cars = getAllCars().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
};
