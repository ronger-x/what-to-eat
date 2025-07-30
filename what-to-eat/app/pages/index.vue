<!-- ~/app.vue -->
<template>
  <div class="bg-gray-100 min-h-screen font-sans p-5">
    <div class="container max-w-2xl mx-auto grid gap-6">

      <!-- 菜品选择器组件 -->
      <DishSelector
          :restaurants="restaurants"
          :selected-dish="selectedDish"
          :is-picking="isPicking"
          @pick-dish="startPicking"
      />

      <!-- 菜单管理组件 -->
      <MenuManager
          :restaurants="restaurants"
          @add-restaurant="addRestaurant"
          @delete-restaurant="deleteRestaurant"
          @add-dish="addDish"
          @delete-dish="deleteDish"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useLocalStorage} from '@vueuse/core';

// --- 类型定义 ---
interface Dish {
  name: string;
  price: string;
}

interface Restaurant {
  id: number;
  name: string;
  dishes: Dish[];
}

interface SelectedDish extends Dish {
  restaurantName: string;
}

// --- 默认数据 ---
const defaultData: Restaurant[] = [
  {
    id: 1,
    name: "航天面馆",
    dishes: [
      { name: "浆水面", price: "14元" }, { name: "手工蘸水面", price: "16元" },
      { name: "臊子汤面", price: "15元" }, { name: "羊肉烩面", price: "26元" },
      { name: "红烧酸菜牛肉面", price: "22元" }, { name: "马记牛肉拉面(毛细)", price: "24元" },
      { name: "热气羊肉面(毛细)", price: "25元" }, { name: "手工油泼面", price: "16元" },
      { name: "手工油泼三合一", price: "22元" }, { name: "手工油泼驴蹄子面", price: "22元" },
      { name: "藤椒鸡丝拌面", price: "16元" }, { name: "大盘鸡拌面", price: "16元" },
      { name: "辣子鸡干拌面", price: "18元" }, { name: "炸酱面", price: "15元" },
      { name: "卤肉拌面", price: "20元" }, { name: "羊肉泡馍", price: "28元" },
      { name: "水盆羊肉", price: "29元" }, { name: "蒸面(猪肉豆角焖面)", price: "18元" },
      { name: "江西鲜肉炒粉", price: "21元" }, { name: "炒拉条子", price: "21元" },
      { name: "羊杂汤", price: "22元" }, { name: "马记牛肉拉面(干拌)", price: "24元" }
    ]
  },
  {
    id: 2,
    name: "肯德基",
    dishes: [
      { "name": "吮指原味鸡", "price": "13元/块" }, { "name": "香辣鸡腿堡", "price": "20元" },
      { "name": "新奥尔良烤翅", "price": "14元/对" }, { "name": "黄金鸡块", "price": "12元/5块" },
      { "name": "薯条(大)", "price": "14元" }, { "name": "葡式蛋挞", "price": "9元" },
      { "name": "劲脆鸡腿堡", "price": "19元" }, { "name": "全家桶", "price": "89元" },
      { "name": "老北京鸡肉卷", "price": "17元" }, { "name": "土豆泥", "price": "7元" },
      { "name": "鸡米花", "price": "15元/盒" }, { "name": "龙卷风", "price": "18元" },
      { "name": "热干面", "price": "15元" }, { "name": "匈牙利风味炖牛肉饭", "price": "25元" },
      { "name": "干烧鳕鱼饭", "price": "25元" }, { "name": "全鸡", "price": "29.9元" },
      { "name": "早餐套餐", "price": "20元" }, { "name": "冰淇淋圣代", "price": "10元" },
      { "name": "可乐(小)", "price": "8元" }, { "name": "炸鸡腿", "price": "15元" }
    ]
  },
  {
    id: 3,
    name: "家常菜馆",
    dishes: [
      { name: "西红柿炒鸡蛋", price: "18元" }, { name: "宫保鸡丁", price: "28元" },
      { name: "鱼香肉丝", price: "26元" }, { name: "麻婆豆腐", price: "16元" },
      { name: "酸辣土豆丝", price: "12元" }, { name: "红烧排骨", price: "45元" },
      { name: "农家小炒肉", price: "28元" }, { name: "糖醋里脊", price: "32元" },
      { name: "地三鲜", price: "22元" }, { name: "可乐鸡翅", price: "30元" },
      { name: "手撕包菜", price: "16元" }, { name: "回锅肉", price: "35元" },
      { name: "清炒时蔬", price: "15元" }, { name: "清蒸鲈鱼", price: "58元" },
      { name: "红烧肉", price: "48元" }, { name: "糖醋小排", price: "42元" },
      { name: "干煸四季豆", price: "22元" }, { name: "京酱肉丝", price: "28元" },
      { name: "水煮肉片", price: "38元" }, { name: "铁板牛肉", price: "45元" }
    ]
  },
  {
    id: 4,
    name: "华莱士",
    dishes: [
      { name: "喷射套餐", price: "19.9元" }
    ]
  }
];

// --- 响应式状态管理 ---

// 使用 @vueuse/core 的 useLocalStorage 实现数据持久化
const restaurants = useLocalStorage<Restaurant[]>('restaurantData-nuxt', defaultData);

const selectedDish = ref<SelectedDish | null>(null);
const isPicking = ref(false);

// --- 页面头部信息 ---
useHead({
  title: '今天吃什么？- 全能版',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap' },
  ],
  bodyAttrs: {
    class: 'antialiased'
  }
});

// --- 核心业务逻辑 ---

const startPicking = (restaurantId: 'all' | number) => {
  let availableDishes: SelectedDish[] = [];

  if (restaurantId === 'all') {
    restaurants.value.forEach(r => {
      r.dishes.forEach(d => availableDishes.push({ ...d, restaurantName: r.name }));
    });
  } else {
    const restaurant = restaurants.value.find(r => r.id == restaurantId);
    if (restaurant) {
      restaurant.dishes.forEach(d => availableDishes.push({ ...d, restaurantName: restaurant.name }));
    }
  }

  if (availableDishes.length === 0) {
    alert('没有菜品可供选择，请先添加菜品！');
    return;
  }

  isPicking.value = true;
  selectedDish.value = null; // 清空上次结果

  const shuffleInterval = setInterval(() => {
    const randomDish = availableDishes[Math.floor(Math.random() * availableDishes.length)];
    selectedDish.value = { ...randomDish, price: '---', restaurantName: '???' }; // 模拟洗牌效果
  }, 100);

  setTimeout(() => {
    clearInterval(shuffleInterval);
    selectedDish.value = availableDishes[Math.floor(Math.random() * availableDishes.length)];
    isPicking.value = false;
  }, 2000); // 动效持续2秒
};

const addRestaurant = (name: string) => {
  if (!name.trim()) {
    alert('请输入餐馆名称！');
    return;
  }
  restaurants.value.push({
    id: Date.now(),
    name: name.trim(),
    dishes: []
  });
};

const addDish = (payload: { name: string; price: string; restaurantId: number }) => {
  const restaurant = restaurants.value.find(r => r.id == payload.restaurantId);
  if (restaurant) {
    restaurant.dishes.push({ name: payload.name, price: payload.price });
  }
};

const deleteRestaurant = (id: number) => {
  if (confirm('确定要删除整个餐馆及其所有菜品吗？此操作不可撤销！')) {
    restaurants.value = restaurants.value.filter(r => r.id !== id);
  }
};

const deleteDish = (payload: { restaurantId: number; dishIndex: number }) => {
  if (confirm('确定要删除这个菜品吗？')) {
    const restaurant = restaurants.value.find(r => r.id === payload.restaurantId);
    if (restaurant) {
      restaurant.dishes.splice(payload.dishIndex, 1);
    }
  }
};
</script>

<style>
/* 将原有的 CSS 变量和基础样式（如字体）放在全局样式中 */
body {
  font-family: 'Noto Sans SC', sans-serif;
}
</style>
