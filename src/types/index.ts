export interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  operational_hours: string;
  price_range: string;
  rating: number;
  image_url: string;
  images: string[];
  created_at: string;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  operational_hours: string;
  price_range: string;
  rating: number;
  image_url: string;
  images: string[];
  created_at: string;
}

export type ItemType = 'place' | 'food';
