<!-- ~/app.vue -->
<template>
  <div class="bg-gray-100 min-h-screen font-sans p-5">
    <div class="container max-w-2xl mx-auto grid gap-6">
      <!-- 菜品选择器组件 -->
      <DishSelector
        :restaurants="restaurants"
        :selected-dishes="selectedDishes"
        :is-picking="isPicking"
        :animation-pool="animationPool"
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
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Dish, Restaurant, SelectedDish } from '~/types'
import { useMenuData } from '~/composables/useMenuData'

const { data } = useMenuData()
const defaultData = ref<Restaurant[]>([])
if (data) {
  const { beverage, restaurant } = data
  beverage.values().forEach((item) => {
    defaultData.value.push(item)
  })
  restaurant.values().forEach((item) => {
    defaultData.value.push(item)
  })
}

// 使用 @vueuse/core 的 useLocalStorage 实现数据持久化
const restaurants = useLocalStorage<Restaurant[]>('restaurantData', defaultData)

const selectedDishes = ref<SelectedDish[] | null>([])
const isPicking = ref(false)
const animationPool = ref<SelectedDish[] | null>([]) // 新增：用于动画的菜品池

// --- 页面头部信息 ---
useHead({
  title: '今天吃什么？- 全能版',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap' }
  ],
  bodyAttrs: {
    class: 'antialiased'
  }
})

// 辅助函数：简单的延时
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// --- 核心业务逻辑 ---
const startPicking = async (config: { restaurantId: 'all' | string, count: number }) => {
  const { restaurantId, count } = config

  if (count <= 0) {
    alert('推荐数量必须大于0！')
    return
  }

  isPicking.value = true
  selectedDishes.value = []

  // 1. 准备一个菜品池，从中进行选择
  const masterPool = getMasterDishPool(restaurantId, count)
  if (!masterPool) {
    isPicking.value = false
    return // getMasterDishPool 内部会 alert
  }

  // 2. 循环N次，每次选择一个菜品
  for (let i = 0; i < count; i++) {
    // 告诉子组件开始为当前这个名额摇奖
    animationPool.value = masterPool.dishes.map(d => ({ ...d, restaurantName: masterPool.name }))
    await delay(2000) // 摇奖动画持续2秒

    // 从剩余的菜品中随机选一个，并从池中移除，防止重复
    const pickedIndex = Math.floor(Math.random() * masterPool.dishes.length)
    const [finalPick] = masterPool.dishes.splice(pickedIndex, 1)

    // 锁定结果：更新已选列表，并停止当前摇奖
    selectedDishes.value.push({ ...finalPick, restaurantName: masterPool.name })
    animationPool.value = null

    // 如果不是最后一个，稍微停顿一下再开始下一次摇奖
    if (i < count - 1) {
      await delay(200) // 0.5秒的停顿，增加节奏感
    }
  }

  // 3. 全部选择完毕
  isPicking.value = false
}
// 重构后的辅助函数：获取一个符合条件的、唯一的餐厅菜品池
const getMasterDishPool = (restaurantId: 'all' | string, count: number): { name: string, dishes: Dish[] } | null => {
  let eligibleRestaurants: Restaurant[] = []

  if (restaurantId === 'all') {
    eligibleRestaurants = restaurants.value.filter(r => r.dishes.length >= count)
  } else {
    const r = restaurants.value.find(r => r.id === restaurantId)
    if (r && r.dishes.length >= count) {
      eligibleRestaurants.push(r)
    } else {
      alert(`“${r?.name || '指定餐厅'}”没有足够的菜品 (${r?.dishes.length || 0}) 来推荐 ${count} 个。`)
      return null
    }
  }

  if (eligibleRestaurants.length === 0) {
    alert(`在所有餐厅中，没有找到任何一家拥有至少 ${count} 个菜品的。`)
    return null
  }

  // 从符合条件的餐厅中随机选出一家
  const chosenRestaurant = eligibleRestaurants[Math.floor(Math.random() * eligibleRestaurants.length)]
  // 返回餐厅名和菜品列表的深拷贝，防止修改原数据
  return { name: chosenRestaurant.name, dishes: JSON.parse(JSON.stringify(chosenRestaurant.dishes)) }
}

const addRestaurant = (name: string, drink: boolean) => {
  if (!name.trim()) {
    alert('请输入餐馆名称！')
    return
  }
  restaurants.value.push({
    id: Date.now().toString(),
    name: name.trim(),
    drink: drink,
    dishes: []
  })
}

const addDish = (payload: { name: string, price: string, restaurantId: string }) => {
  const restaurant = restaurants.value.find(r => r.id == payload.restaurantId)
  if (restaurant) {
    restaurant.dishes.push({ name: payload.name, price: payload.price })
  }
}

const deleteRestaurant = (id: string) => {
  if (confirm('确定要删除整个餐馆及其所有菜品吗？此操作不可撤销！')) {
    restaurants.value = restaurants.value.filter(r => r.id !== id)
  }
}

const deleteDish = (payload: { restaurantId: string, dishIndex: number }) => {
  if (confirm('确定要删除这个菜品吗？')) {
    const restaurant = restaurants.value.find(r => r.id === payload.restaurantId)
    if (restaurant) {
      restaurant.dishes.splice(payload.dishIndex, 1)
    }
  }
}
</script>

<style>
/* 将原有的 CSS 变量和基础样式（如字体）放在全局样式中 */
body {
  font-family: 'Noto Sans SC', sans-serif;
}
</style>
