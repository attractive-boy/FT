<template>
  <div class="flex flex-col justify-between min-h-screen">
    <div class="p-5">
      
      <!-- 表单 -->
      <nut-form>
        <nut-form-item label="报备人">
          <nut-input
            v-model="userInfo.nick_name"
            type="text"
            readonly
          />
        </nut-form-item>
        <MyDatePickerCell
          title="预存时间"
          v-model="formData.store_time"
          type="datetime"
          :is-show-chinese="true"
        />
        <nut-form-item label="预存金额">
          <nut-input
            v-model="formData.amount"
            type="number"
            
          />
        </nut-form-item>
        <nut-form-item label="老板名字">
          <nut-input
            v-model="formData.boss"
            placeholder="请输入老板微信昵称或游戏ID"
            type="text"
          />
        </nut-form-item>
      </nut-form>
      
      <nut-button @click="reportStore" type="success" block
        >提交报备</nut-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MyDatePickerCell from '@/components/MyComponents/MyDatePickerCell.vue';
import httpPost from '@/utils/http';
import Taro from '@tarojs/taro';
import { message } from '@/utils/message';
import { getUserInfo } from '@/utils/auth';

interface FormData {
  store_time: number;
  amount: string;
  boss: string;
}

const userInfo = getUserInfo();
const formData = ref<FormData>({
  store_time: Date.now(),
  amount: '',
  boss: ''
});

const reportStore = async () => {
  if (!formData.value.store_time || !formData.value.amount || !formData.value.boss) {
    message('请完整填写表单');
    return;
  }
  try {
    const response = await httpPost('/report.store', formData.value);
    console.log(response);
    if (response) {
      message('报备成功');
    } else {
      message('报备失败');
    }
  } catch (error) {
    message('报备失败，请稍后重试');
  }
};

onMounted(async () => {
  // 任何你想在组件挂载时执行的逻辑
});
</script>

<style scoped></style>
