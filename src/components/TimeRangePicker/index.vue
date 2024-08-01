<!--
 * @Description: 自定义日期区间选择器
 * @Author: knight
 * @Date: 2022-10-08 09:39:46
 * @LastEditTime: 2022-10-08 17:03:39
 * @LastEditors: knight
-->
<template>
    <view>
      <nut-row type="flex">
        <nut-col :span="14">
          <nut-cell title="日期区间" :desc="start ? `${startDesc}` : '开始日期'" @click="startShow = true" />
        </nut-col>
        <nut-col :span="10">
          <nut-cell title="~" :desc="end ? `${endDesc}` : '结束日期'" @click="endShow = true" />
        </nut-col>
      </nut-row>
      <nut-datepicker
        v-model="start"
        v-model:visible="startShow"
        :min-date="minDate"
        :max-date="maxDate"
        :is-show-chinese="false"
        :three-dimensional="false"
        @confirm="startConfirm"
      />
      <nut-datepicker
        v-model="end"
        v-model:visible="endShow"
        :min-date="minDate"
        :max-date="maxDate"
        :is-show-chinese="false"
        :three-dimensional="false"
        @confirm="endConfirm"
      />
    </view>
  </template>
  <script lang="ts" setup>
    import { defineComponent, ref, watchEffect } from 'vue';
    import * as dayjs from 'dayjs';
   
    interface MyDateRangePickerProps {
      modelValue?: any[],
      minDate?: any,
      maxDate?: any,
    }
    const props = withDefaults(defineProps<MyDateRangePickerProps>(), {
      minDate: dayjs().subtract(2, 'year').toDate(),
      maxDate: new Date(),
    });
    const emit = defineEmits(['update:modelValue']);
   
    const data = ref<any[]>();
    const start = ref();
    const startShow = ref(false);
    const startDesc = ref();
    const end = ref();
    const endShow = ref(false);
    const endDesc = ref();
    
    watchEffect(() => {
      data.value = [props.modelValue?.[0], props.modelValue?.[1]];
      start.value = props.modelValue?.[0];
      startDesc.value = props.modelValue?.[0];
      end.value = props.modelValue?.[1];
      endDesc.value = props.modelValue?.[1];
    });
   
    // 开始日期确定事件
    function startConfirm({ selectedValue, selectedOptions }) {
      startDesc.value = selectedOptions.map((option) => option.text).join('-');
      start.value = selectedValue.join('-');
      if(dayjs(start.value).isAfter(end.value)){
        end.value = undefined;
      }
      data.value = [start.value ?? null, end.value ?? null];
      emit('update:modelValue', data.value);
    }
   
    // 结束日期确定事件
    function endConfirm({ selectedValue, selectedOptions }) {
      endDesc.value = selectedOptions.map((option) => option.text).join('-');
      end.value = selectedValue.join('-');
      if(dayjs(start.value).isAfter(end.value)){
        start.value = undefined;
      }
      data.value = [start.value ?? null, end.value ?? null];
      emit('update:modelValue', data.value);
    }
  </script>
  <script lang="ts">
    export default defineComponent({
      name: 'MyDateRangePicker',
    });
  </script>