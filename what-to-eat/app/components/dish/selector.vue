<template>
  <div class="card">
    <h1 class="text-3xl font-bold text-red-700 text-center mb-4">今天吃什么？</h1>

    <div class="result-card">
      <!-- 结果展示 -->
      <div v-if="selectedDish && !isPicking" class="text-center">
        <p class="text-4xl font-bold text-red-800">{{ selectedDish.name }}</p>
        <p class="mt-1 text-sm text-gray-500 bg-gray-200 inline-block px-3 py-1 rounded-full">{{ selectedDish.restaurantName }}</p>
        <p class="mt-2 text-xl font-bold text-green-600">{{ selectedDish.price }}</p>
      </div>
      <!-- 选择中动效 -->
      <div v-else-if="isPicking && selectedDish" class="text-center animate-pulse">
        <p class="text-4xl font-bold text-red-800">{{ selectedDish.name }}</p>
      </div>
      <!-- 初始占位符 -->
      <div v-else class="text-center">
        <p class="text-2xl text-gray-500">祝您用餐愉快!</p>
      </div>
    </div>

    <div class="flex gap-4 items-center justify-center flex-wrap mt-4">
      <select v-model="selectedRestaurant" class="input flex-grow">
        <option value="all">所有餐馆</option>
        <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
      </select>
      <button @click="$emit('pickDish', selectedRestaurant)" :disabled="isPicking" class="btn-primary">
        {{ isPicking ? '选择中...' : (selectedDish ? '再选一次！' : '开始选择') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// --- 类型定义 ---
interface Dish { name: string; price: string; }
interface Restaurant { id: number; name: string; dishes: Dish[]; }
interface SelectedDish extends Dish { restaurantName: string; }

// --- Props & Emits ---
defineProps<{
  restaurants: Restaurant[],
  selectedDish: SelectedDish | null,
  isPicking: boolean,
}>();

defineEmits(['pickDish']);

// --- 组件内部状态 ---
const selectedRestaurant = ref<'all' | number>('all');
</script>

<style scoped>
@reference "tailwindcss";
/* 使用 @apply 指令复用 Tailwind CSS 类，或编写组件特定样式 */
.card {
  @apply bg-white p-6 rounded-xl shadow-md;
}
.result-card {
  @apply bg-yellow-50 border-2 border-dashed border-amber-400 p-5 h-40 flex flex-col justify-center items-center rounded-lg my-4 transition-all duration-300;
}
.input {
  @apply p-3 border border-gray-300 rounded-md w-full box-border text-base;
}
.btn-primary {
  @apply bg-red-600 text-white font-bold py-3 px-6 rounded-md cursor-pointer transition-all duration-300 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed;
}
</style>
