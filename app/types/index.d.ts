// --- 类型定义 ---
export interface Dish {
  name: string
  price: string
  description?: string
}

export interface Restaurant {
  id: string
  name: string
  drink?: boolean
  dishes: Dish[]
}

export interface SelectedDish extends Dish {
  restaurantName: string
}
