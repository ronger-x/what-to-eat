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

// --- 默认数据 ---
const defaultData: Restaurant[] = [
  {
    id: 1,
    name: '航天面馆',
    drink: false,
    dishes: [
      { name: '浆水面', price: '14元' }, { name: '手工蘸水面', price: '16元' },
      { name: '臊子汤面', price: '15元' }, { name: '羊肉烩面', price: '26元' },
      { name: '红烧酸菜牛肉面', price: '22元' }, { name: '马记牛肉拉面(毛细)', price: '24元' },
      { name: '热气羊肉面(毛细)', price: '25元' }, { name: '手工油泼面', price: '16元' },
      { name: '手工油泼三合一', price: '22元' }, { name: '手工油泼驴蹄子面', price: '22元' },
      { name: '藤椒鸡丝拌面', price: '16元' }, { name: '大盘鸡拌面', price: '16元' },
      { name: '辣子鸡干拌面', price: '18元' }, { name: '炸酱面', price: '15元' },
      { name: '卤肉拌面', price: '20元' }, { name: '羊肉泡馍', price: '28元' },
      { name: '水盆羊肉', price: '29元' }, { name: '蒸面(猪肉豆角焖面)', price: '18元' },
      { name: '江西鲜肉炒粉', price: '21元' }, { name: '炒拉条子', price: '21元' },
      { name: '羊杂汤', price: '22元' }, { name: '马记牛肉拉面(干拌)', price: '24元' }
    ]
  },
  {
    id: 2,
    name: '肯德基',
    drink: false,
    dishes: [
      { name: '吮指原味鸡', price: '13元/块' }, { name: '香辣鸡腿堡', price: '20元' },
      { name: '新奥尔良烤翅', price: '14元/对' }, { name: '黄金鸡块', price: '12元/5块' },
      { name: '薯条(大)', price: '14元' }, { name: '葡式蛋挞', price: '9元' },
      { name: '劲脆鸡腿堡', price: '19元' }, { name: '全家桶', price: '89元' },
      { name: '老北京鸡肉卷', price: '17元' }, { name: '土豆泥', price: '7元' },
      { name: '鸡米花', price: '15元/盒' }, { name: '龙卷风', price: '18元' },
      { name: '热干面', price: '15元' }, { name: '匈牙利风味炖牛肉饭', price: '25元' },
      { name: '干烧鳕鱼饭', price: '25元' }, { name: '全鸡', price: '29.9元' },
      { name: '早餐套餐', price: '20元' }, { name: '冰淇淋圣代', price: '10元' },
      { name: '可乐(小)', price: '8元' }, { name: '炸鸡腿', price: '15元' }
    ]
  },
  {
    id: 3,
    name: '家常菜馆',
    drink: false,
    dishes: [
      { name: '西红柿炒鸡蛋', price: '18元' }, { name: '宫保鸡丁', price: '28元' },
      { name: '鱼香肉丝', price: '26元' }, { name: '麻婆豆腐', price: '16元' },
      { name: '酸辣土豆丝', price: '12元' }, { name: '红烧排骨', price: '45元' },
      { name: '农家小炒肉', price: '28元' }, { name: '糖醋里脊', price: '32元' },
      { name: '地三鲜', price: '22元' }, { name: '可乐鸡翅', price: '30元' },
      { name: '手撕包菜', price: '16元' }, { name: '回锅肉', price: '35元' },
      { name: '清炒时蔬', price: '15元' }, { name: '清蒸鲈鱼', price: '58元' },
      { name: '红烧肉', price: '48元' }, { name: '糖醋小排', price: '42元' },
      { name: '干煸四季豆', price: '22元' }, { name: '京酱肉丝', price: '28元' },
      { name: '水煮肉片', price: '38元' }, { name: '铁板牛肉', price: '45元' }
    ]
  },
  {
    id: 4,
    name: '华莱士',
    drink: false,
    dishes: [
      { name: '喷射套餐', price: '19.9元' }
    ]
  },
  {
    id: 5,
    name: '网红饮品店 (RETTER)',
    drink: true,
    dishes: [
      // --- 手工制作 ---
      { name: '黑糖珍珠奶茶(中)', price: '12元' },
      { name: '黑糖珍珠奶茶(大)', price: '15元' },
      { name: '黑糖珍珠奶绿(中)', price: '12元' },
      { name: '黑糖珍珠奶绿(大)', price: '15元' },
      { name: '黑糖珍珠牛奶(中)', price: '15元' },
      { name: '黑糖珍珠牛奶(大)', price: '18元' },
      { name: '黑糖珍珠抹茶(中)', price: '12元' },
      { name: '黑糖珍珠抹茶(大)', price: '15元' },
      { name: '抹茶珍珠牛乳(中)', price: '15元' },
      { name: '抹茶珍珠牛乳(大)', price: '18元' },
      { name: '双皮奶', price: '13元' },
      // --- 牛奶 ---
      { name: '桂花龙眼鲜牛乳(中)', price: '18元' },
      { name: '桂花龙眼鲜牛乳(大)', price: '22元' },
      { name: '板栗糯糯鲜牛乳(中)', price: '18元' },
      { name: '板栗糯糯鲜牛乳(大)', price: '22元' },
      // --- 椰奶 ---
      { name: '生椰大满贯', price: '16元' },
      { name: '芒果椰浆紫米捞(中)', price: '15元' },
      { name: '芒果椰浆紫米捞(大)', price: '18元' },
      { name: '杨枝甘露(中)', price: '18元' },
      { name: '杨枝甘露(大)', price: '20元' },
      { name: '生椰西瓜', price: '18元' },
      // --- 酸奶奶昔 ---
      { name: '芒果酸奶奶昔', price: '25元' },
      { name: '山楂酸奶奶昔', price: '25元' },
      { name: '牛油果酸奶奶昔', price: '25元' },
      // --- 冰沙 ---
      { name: '红豆牛乳冰', price: '18元' },
      { name: '绿豆牛乳冰', price: '18元' },
      // --- 果茶 ---
      { name: '香橙热红茶', price: '18元' },
      { name: '青柚爆柠', price: '16元' },
      { name: '多肉葡萄', price: '18元' },
      { name: '菠萝百香果', price: '18元' },
      { name: '香橙冰红茶', price: '18元' },
      { name: '香橙茉莉冰奶', price: '18元' },
      { name: '青提柠檬茶', price: '18元' },
      // --- 奶茶 ---
      { name: '桂花栗子牛乳茶', price: '16元' },
      { name: '桂花酒酿奶茶', price: '18元' },
      { name: '桂花乌龙', price: '18元' },
      // --- 乳酸菌 ---
      { name: '金桔柠檬养乐多', price: '18元' },
      { name: '蜜桃养乐多', price: '18元' },
      { name: '西柚乳酸菌', price: '18元' },
      // --- 1L大桶畅饮 ---
      { name: '大桶水果茶(1L)', price: '25元' },
      { name: '古法酸梅汤(1L)', price: '20元' },
      { name: '港式冻柠茶(1L)', price: '20元' },
      { name: '青芒冰茶(1L)', price: '20元' },
      // --- 经典咖啡 ---
      { name: '美式', price: '10元' },
      { name: '拿铁', price: '15元' },
      { name: '卡布奇诺', price: '15元' },
      { name: '生椰拿铁', price: '16元' },
      { name: '燕麦拿铁', price: '20元' },
      // --- 风味咖啡 ---
      { name: '摩卡', price: '16元' },
      { name: '香草拿铁', price: '18元' },
      { name: '榛果拿铁', price: '18元' },
      { name: '青柚美式', price: '14元' },
      { name: '黄杏美式', price: '14元' },
      { name: '椰青美式', price: '14元' },
      { name: '橙C美式', price: '14元' },
      { name: '桂花拿铁', price: '18元' },
      { name: '山茶花拿铁', price: '18元' },
      { name: '黄油拿铁', price: '20元' },
      { name: '蜂糖拿铁', price: '20元' }
    ]
  },
  {
    id: 6,
    name: '克莱因·蓝 (Klein Blue)',
    drink: true,
    dishes: [
      // --- 咖啡 ---
      { name: '香醇美式(热/冰)', price: '20元' },
      { name: '原味拿铁(热/冰)', price: '25元' },
      { name: '椰蓉拿铁(热/冰)', price: '35元' },
      { name: '米乳拿铁(热/冰)', price: '35元' },
      { name: '龙井拿铁(热/冰)', price: '35元' },
      { name: '鸳鸯拿铁(热/冰)', price: '35元' },
      { name: '蓝柑拿铁(热/冰)', price: '35元' },
      { name: '月桂春山(热/冰)', price: '38元' },
      { name: '草莓茉莉拿铁(热/冰)', price: '25元' },
      { name: '陈皮话梅美式(热/冰)', price: '25元' },
      { name: '乌龙冰茶拿铁(冰)', price: '25元' },
      // --- 茶饮 ---
      { name: '红豆红枣茶(热)', price: '25元' },
      { name: '青桔柠檬茶(冰)', price: '20元' },
      { name: '茉香奶蓝(热/冰)', price: '25元' },
      { name: '草莓奶昔(热/冰)', price: '30元' },
      { name: '雪吻莓踪(热/冰)', price: '25元' },
      { name: '抹香茉莉(热/冰)', price: '25元' },
      { name: '醇香可可(热/冰)', price: '25元' },
      { name: '草莓茉绿茶(热/冰)', price: '25元' },
      { name: '冰摇葡萄黑乌龙(热/冰)', price: '20元' },
      { name: '芒果椰椰冰(冰)', price: '35元' },
      { name: '芒果柠檬茶(冰)', price: '30元' },
      { name: '葡萄瑞纳冰(冰)', price: '30元' },
      { name: '绿语葡萄(冰)', price: '25元' },
      { name: '凤梨碎碎冰(冰)', price: '30元' },
      { name: '百香凤梨果茶(冰)', price: '30元' },
      { name: '莓莓椰椰冰(冰)', price: '38元' }
    ]
  }
]

const dataVersion = ref('0.0.1')

// --- 响应式状态管理 ---

// 使用 @vueuse/core 的 useLocalStorage 实现数据持久化
const restaurants = useLocalStorage<Restaurant[]>('restaurantData', defaultData)
const version = useLocalStorage<string>('restaurantVersion', dataVersion)

if (version !== dataVersion.value) {
  restaurants.value = defaultData
}

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
const startPicking = async (config: { restaurantId: 'all' | number, count: number }) => {
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
const getMasterDishPool = (restaurantId: 'all' | number, count: number): { name: string, dishes: Dish[] } | null => {
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
    id: Date.now(),
    name: name.trim(),
    drink: drink,
    dishes: []
  })
}

const addDish = (payload: { name: string, price: string, restaurantId: number }) => {
  const restaurant = restaurants.value.find(r => r.id == payload.restaurantId)
  if (restaurant) {
    restaurant.dishes.push({ name: payload.name, price: payload.price })
  }
}

const deleteRestaurant = (id: number) => {
  if (confirm('确定要删除整个餐馆及其所有菜品吗？此操作不可撤销！')) {
    restaurants.value = restaurants.value.filter(r => r.id !== id)
  }
}

const deleteDish = (payload: { restaurantId: number, dishIndex: number }) => {
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
