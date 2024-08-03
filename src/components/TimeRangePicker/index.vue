<!--
 * @Description: 自定义日期区间选择器
 * @Author: knight
 * @Date: 2022-10-08 09:39:46
 * @LastEditTime: 2022-10-08 17:03:39
 * @LastEditors: knight
-->
<template>
    <view class="time-range-picker">
      <nut-row type="flex">
        <nut-col :span="14">
          <nut-cell title="日期区间"  :desc="start ? `${startDesc}` : '开始日期'" @click="startShow = true"  style="font-size: 12px !important;" />
        </nut-col>
        <nut-col :span="14">
          <nut-cell title="~" :desc="end ? `${endDesc}` : '结束日期'" @click="endShow = true"  style="font-size: 12px !important;" />
        </nut-col>
      </nut-row>
      <nut-popup v-model:visible="startShow" position="bottom">
        <nut-date-picker
            v-model="start"
            :min-date="minDate"
            :max-date="maxDate"
            :is-show-chinese="false"
            :three-dimensional="false"
            @confirm="startConfirm"
            @cancel="startCancel"
        ></nut-date-picker>
        </nut-popup>
        <nut-popup v-model:visible="endShow" position="bottom">
        <nut-date-picker
            v-model="end"
            :min-date="minDate"
            :max-date="maxDate"
            :is-show-chinese="false"
            :three-dimensional="false"
            @confirm="endConfirm"
            @cancel="endCancel"
        ></nut-date-picker>
        </nut-popup>
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
    
    // watchEffect(() => {
    //   data.value = [props.modelValue?.[0], props.modelValue?.[1]];
    //   start.value = props.modelValue?.[0];
    //   console.log("watch==>start",props.modelValue?.[0]);
    //   startDesc.value = props.modelValue?.[0];
    //   end.value = props.modelValue?.[1];
    //   endDesc.value = props.modelValue?.[1];
    // });
   
    // 开始日期确定事件
    function startConfirm({ selectedValue, selectedOptions }) {
      startDesc.value = selectedOptions.map((option) => option.text).join('-');
      start.value = selectedValue.join('-');
      if(dayjs(start.value).isAfter(end.value)){
        end.value = undefined;
      }
      data.value = [start.value ?? null, end.value ?? null];
      emit('update:modelValue', data.value);
      console.log(data.value);
      startShow.value = false;
    }
   
    // 结束日期确定事件
    function endConfirm({ selectedValue, selectedOptions }) {
      console.log("endconfirm==>", start.value);
      endDesc.value = selectedOptions.map((option) => option.text).join('-');
      end.value = selectedValue.join('-');
      if(dayjs(start.value).isAfter(end.value)){
        console.log('开始时间不能大于结束时间');
        start.value = undefined;
      }
      data.value = [start.value ?? null, end.value ?? null];
      emit('update:modelValue', data.value);
      console.log(data.value);
      endShow.value = false;
    }

    function startCancel () {
      startShow.value = false;
    }

    function endCancel () {
      endShow.value = false;
    }
  </script>
  <script lang="ts">
    export default defineComponent({
      name: 'MyDateRangePicker',
    });
  </script>
  <style lang="scss">
  .time-range-picker{
    .nut-cell__title{
        flex: 0.6 !important;
        min-width: unset !important;
    }
  }
    
  </style>