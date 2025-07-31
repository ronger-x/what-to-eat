// --- 类型定义 ---
export interface Dish {
  name: string;
  price: string;
}

export interface Restaurant {
  id: number;
  name: string;
  drink: boolean;
  dishes: Dish[];
}

export interface SelectedDish extends Dish {
  restaurantName: string;
}
