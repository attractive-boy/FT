<template>
  <nut-popup v-model:visible="options.visible" position="bottom">
    <nut-picker
      v-model="pickerItem"
      :columns="options.columns"
      :title="options.title"
      @confirm="confirm"
      @cancel="emits('close')"
    />
  </nut-popup>
  <div>
    <!-- 蒙版 -->
    <div
      class="bg-slate-300 opacity-30 w-full h-full fixed top-0 left-0 z-10"
      @click="emits('close')"
    ></div>
    <!-- 时间选择器容器 -->
    <div class="absolute bottom-0 left-0 right-0 z-20">
      <nut-date-picker
        v-model="defaultDate"
        :three-dimensional="false"
        :min-date="new Date(1970, 0, 1)"
        :max-date="new Date()"
        @confirm="options.sure(defaultDate), emits('close')"
        @cancel="emits('close')"
      ></nut-date-picker>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type DatePickerOptions } from "./type";

const emits = defineEmits(["close"]);
const props = defineProps<{ options: DatePickerOptions }>();

const defaultDate = props.options.date;
</script>
