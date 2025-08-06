<template>
  <div class="card">
    <h1 class="text-3xl font-bold text-red-700 text-center mb-4">
      今天吃什么？
    </h1>

    <div class="result-card">
      <!-- 1. 渲染已锁定的菜品列表 -->
      <div v-if="selectedDishes.length > 0" class="w-full text-left p-2 space-y-3">
        <div v-for="(dish, index) in selectedDishes" :key="dish.name + index" class="locked-in-item">
          <p class="text-2xl font-bold text-red-800">
            {{ dish.name }}
          </p>
          <div class="flex justify-between items-baseline">
            <p class="text-sm text-gray-500 bg-gray-200 inline-block px-2 py-0.5 rounded-full">
              {{ dish.restaurantName }}
            </p>
            <p class="text-lg font-bold text-green-600">
              {{ dish.price }}
            </p>
          </div>
        </div>
      </div>

      <!-- 2. 渲染当前正在进行的摇奖动画 -->
      <div v-if="isPicking" class="w-full text-center p-2 current-pick-animation">
        <Transition name="shuffle" mode="out-in">
          <div :key="displayDishForAnimation?.name" class="flex flex-col items-center">
            <p class="text-3xl lg:text-4xl font-bold text-gray-700 truncate max-w-full px-2">
              {{ displayDishForAnimation?.name }}
            </p>
          </div>
        </Transition>
      </div>
      <!-- 初始占位符 -->
      <div v-else class="text-center">
        <p class="text-2xl text-gray-500">
          祝您用餐愉快!
        </p>
      </div>
    </div>

    <div class="flex gap-4 items-center justify-center flex-wrap mt-4">
      <select v-model="selectedRestaurant" class="input flex-grow">
        <option value="all">
          所有餐馆
        </option>
        <option v-for="r in restaurants" :key="r.id" :value="r.id">
          {{ r.name }}
        </option>
      </select>
      <!-- 新增：推荐数量输入框 -->
      <div class="flex items-center gap-2">
        <label for="count" class="font-semibold w-12 text-gray-600">数量:</label>
        <input
          id="count"
          v-model.number="countToRecommend"
          type="number"
          min="1"
          class="input w-20 text-center"
        >
      </div>
      <button
        :disabled="isPicking"
        class="btn-primary w-full md:w-auto flex-grow"
        @click="$emit('pickDish', { restaurantId: selectedRestaurant, count: countToRecommend })"
      >
        {{ isPicking ? '选择中...' : (selectedDishes ? '再选一次！' : '开始选择') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Restaurant, SelectedDish } from '~/types'

// --- Props & Emits ---
const props = defineProps<{
  restaurants: Restaurant[]
  selectedDishes: SelectedDish[] // 现在是最终列表
  isPicking: boolean
  animationPool: SelectedDish[] | null // 当前摇奖的菜品池
}>()

defineEmits(['pickDish'])

// --- 组件内部状态 ---
const selectedRestaurant = ref<'all' | number>('all')
const countToRecommend = ref(1) // 新增状态，默认推荐1个

// 新增：用于摇奖动画的状态
const displayDishForAnimation = ref<SelectedDish | null>(null)
let animationInterval: ReturnType<typeof setInterval> | null = null

// 监听 animationPool 的变化来启停单次动画
watch(() => props.animationPool, (pool) => {
  if (pool && pool.length > 0) {
    animationInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length)
      displayDishForAnimation.value = pool[randomIndex]
    }, 75)
  } else {
    if (animationInterval) {
      clearInterval(animationInterval)
      animationInterval = null
    }
    displayDishForAnimation.value = null
  }
}, { deep: true })
</script>

<style scoped>
@reference "tailwindcss";
/* 使用 @apply 指令复用 Tailwind CSS 类，或编写组件特定样式 */
.card {
  @apply bg-white p-6 rounded-xl shadow-md;
}
.result-card {
  @apply bg-yellow-50 border-2 border-dashed border-amber-400 p-5 flex flex-col gap-3 rounded-lg my-4 transition-all duration-300;
}
.locked-in-item {
  @apply border-b border-amber-200 pb-2 last:border-b-0;
}
.current-pick-animation {
  @apply min-h-[4rem] flex items-center justify-center;
}
.input {
  @apply p-3 border border-gray-300 rounded-md w-full box-border text-base;
}
.btn-primary {
  @apply bg-red-600 text-white font-bold py-3 px-6 rounded-md cursor-pointer transition-all duration-300 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}

/* Vue Transition 动画效果 */
.shuffle-enter-active,
.shuffle-leave-active {
  transition: all 0.07s ease-in-out;
}

.shuffle-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.shuffle-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
