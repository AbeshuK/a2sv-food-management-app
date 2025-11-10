export interface Food {
  id: string; 
  createdAt: string; 
  name: string;
  avatar: string;
  logo: string;
  rating: number | string; 
  open: boolean;
  Price?: number | string; 
  price?: number | string;
  food_name?: string;
  food_image?: string;
  food_rating?: number | string;
  restaurant_name?: string;
  restaurant_image?: string;
  restaurant_logo?: string;
  restaurant_status?: string;
  status?: string;
  type?: string;
}
