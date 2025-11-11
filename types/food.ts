export interface Food {
  id: string;
  name: string;
  createdAt: string;
  avatar: string;             
  image?: string;            
  logo?: string;   

  rating: number | string;
  Price?: number | string;    
  price?: number | string; 
  
  restaurantName?: string;    
  restaurant?: {
    name?: string;
    logo?: string;
    status?: string;
  }; 
  
  open: boolean;
  status?: string;           
  restaurant_status?: string; 
  type?: string;              

  food_name?: string;
  food_image?: string;
  food_rating?: number | string;
  restaurant_image?: string;
  restaurant_logo?: string;
}
