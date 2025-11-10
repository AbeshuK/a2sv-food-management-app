import { Food } from '@/types/food';

export const RestaurantService = {
  async getFeaturedFoods(): Promise<Food[]> {
    try {
      const res = await fetch('https://6852821e0594059b23cdd834.mockapi.io/Food', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      console.log('Raw response:', res);

      const data: Food[] = await res.json();
      console.log('Parsed JSON data:', data);

      return data;
    } catch (err) {
      console.error('Error fetching featured foods:', err);
      throw err;
    }
  },
};
