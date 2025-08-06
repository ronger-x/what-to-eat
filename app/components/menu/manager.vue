<!-- ~/components/MenuManager.vue -->
<template>
  <details class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
    <summary class="p-4 font-bold text-lg cursor-pointer bg-gray-50 select-none hover:bg-gray-100">
      餐馆与菜品管理
    </summary>
    <div class="p-6 grid gap-6">
      <!-- 添加餐馆 -->
      <div class="p-4 border rounded-lg">
        <h3 class="font-bold text-red-700 mb-3">
          添加新餐馆
        </h3>
        <div class="flex gap-2">
          <input
            v-model="newRestaurantName"
            type="text"
            placeholder="输入餐馆名称"
            class="input flex-grow"
          >
          <select v-model="newRestaurantDrink" class="input flex-grow">
            <option :value="false">
              餐馆
            </option>
            <option :value="true">
              饮品店
            </option>
          </select>
          <button class="btn-add" @click="handleAddRestaurant">
            添加
          </button>
        </div>
      </div>

      <!-- 添加菜品 -->
      <div class="p-4 border rounded-lg">
        <h3 class="font-bold text-red-700 mb-3">
          添加新菜品
        </h3>
        <div class="grid gap-4">
          <input
            v-model="newDish.name"
            type="text"
            placeholder="菜名"
            class="input"
            :disabled="!canAddDish"
          >
          <input
            v-model="newDish.price"
            type="text"
            placeholder="价格, 如: 20元"
            class="input"
            :disabled="!canAddDish"
          >
          <select v-model="newDish.restaurantId" class="input" :disabled="!canAddDish">
            <option disabled value="">
              选择归属餐馆
            </option>
            <option v-for="r in restaurants" :key="r.id" :value="r.id">
              {{ r.name }}
            </option>
          </select>
          <button class="btn-add w-full" :disabled="!canAddDish" @click="handleAddDish">
            添加菜品
          </button>
        </div>
      </div>

      <!-- 已有列表 -->
      <div class="p-4 border rounded-lg">
        <h3 class="font-bold text-red-700 mb-3">
          自定义餐馆和菜品
        </h3>
        <ul class="space-y-4">
          <li v-for="resto in restaurants" :key="resto.id" class="bg-gray-50 p-3 rounded-md">
            <div class="flex justify-between items-center font-bold">
              <span>{{ resto.name }}</span>
              <button class="btn-delete" @click="$emit('deleteRestaurant', resto.id)">
                删除餐馆
              </button>
            </div>
            <ul class="pl-5 mt-2 text-sm space-y-1">
              <li v-for="(dish, index) in resto.dishes" :key="index" class="flex justify-between items-center text-gray-700">
                <span>{{ dish.name }} - {{ dish.price }}</span>
                <button class="btn-delete" @click="$emit('deleteDish', { restaurantId: resto.id, dishIndex: index })">
                  删除
                </button>
              </li>
              <li v-if="!resto.dishes.length" class="text-gray-400 italic">
                暂无菜品
              </li>
            </ul>
          </li>
          <p v-if="!restaurants.length" class="text-gray-500 italic">
            还没有任何餐馆哦~
          </p>
        </ul>
      </div>
      <div class="p-4 border rounded-lg">
        <h3 class="font-bold text-red-700 mb-3">
          系统餐馆和菜品
        </h3>
        <ul class="space-y-4">
          <li v-for="resto in systemRestaurants" :key="resto.id" class="bg-gray-50 p-3 rounded-md">
            <div class="flex justify-between items-center font-bold">
              <span>{{ resto.name }}</span>
            </div>
            <ul class="pl-5 mt-2 text-sm space-y-1">
              <li v-for="(dish, index) in resto.dishes" :key="index" class="flex justify-between items-center text-gray-700">
                <span>{{ dish.name }} - {{ dish.price }}</span>
              </li>
              <li v-if="!resto.dishes.length" class="text-gray-400 italic">
                暂无菜品
              </li>
            </ul>
          </li>
          <p v-if="!systemRestaurants.length" class="text-gray-500 italic">
            还没有任何餐馆哦~
          </p>
        </ul>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Restaurant } from '~/types'

// --- Props & Emits ---
const props = defineProps<{
  restaurants: Restaurant[]
  systemRestaurants: Restaurant[]
}>()

const emit = defineEmits(['addRestaurant', 'deleteRestaurant', 'addDish', 'deleteDish'])

// --- 组件内部状态 ---
const newRestaurantName = ref('')
const newRestaurantDrink = ref(false)
const newDish = reactive({
  name: '',
  price: '',
  drink: false,
  restaurantId: '' as '' | number
})

// --- 计算属性 ---
const canAddDish = computed(() => props.restaurants.length > 0)

// --- 监听器 ---
// 如果没有餐厅，则清空添加菜品表单的 restaurantId
watch(canAddDish, (can) => {
  if (!can) {
    newDish.restaurantId = ''
  }
})

// --- 事件处理函数 ---
const handleAddRestaurant = () => {
  emit('addRestaurant', newRestaurantName.value)
  newRestaurantName.value = '' // 清空输入
}

const handleAddDish = () => {
  if (!newDish.name.trim() || !newDish.price.trim() || !newDish.restaurantId) {
    alert('请填写完整的菜品信息！')
    return
  }
  emit('addDish', {
    ...newDish,
    restaurantId: Number(newDish.restaurantId)
  })
  // 清空表单
  newDish.name = ''
  newDish.price = ''
}
</script>

<style scoped>
@reference "tailwindcss";
.input {
  @apply p-2 border border-gray-300 rounded-md w-full box-border text-base;
}
.btn-add {
  @apply bg-blue-500 text-white font-semibold py-2 px-4 rounded-md cursor-pointer transition-colors hover:bg-blue-600 disabled:bg-gray-300;
}
.btn-delete {
  @apply bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-md cursor-pointer transition-colors hover:bg-red-600;
}
</style>
