<template>
  <div class="h-10 w-full leading-10 relative">
    <ul class="w-full flex shadow-lg">
      <li
        class="flex-1 text-center"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="emits('update:modelValue', index)"
        :style="{
          color: props.textColor || 'black',
        }"
      >
        {{ tab }}
      </li>
      <div
        class="bar absolute left-0 bottom-0 h-1 transition-all duration-500"
        :style="{
          left: `${(props.modelValue * 100) / tabs.length}%`,
          width: `${100 / tabs.length}%`,
          backgroundColor: props.barColor || 'skyblue',
        }"
      ></div>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
  tabs: string[];
  textColor?: string;
  barColor?: string;
  reality?: boolean;
}>();
const emits = defineEmits(["update:modelValue"]);
</script>
