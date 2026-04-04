export interface Car {
  id: string;
  name: string;
  details: string;
  image: string;
}

export const cars: Car[] = [
  {
    id: "CK-9908122",
    name: "Maruti Suzuki Baleno RS",
    details: "1.0L BoosterJet • Petrol • 32,000 KMs",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CK-8807100",
    name: "Honda City i-VTEC",
    details: "1.5L Petrol • Manual • 45,000 KMs",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "CK-7706099",
    name: "Hyundai Verna Turbo",
    details: "1.5L Turbo Petrol • DCT • 12,000 KMs",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259c6e09?q=80&w=800&auto=format&fit=crop"
  }
];
