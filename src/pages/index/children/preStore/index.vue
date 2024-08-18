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
        <nut-form-item label="所在群聊">
          <nut-input
            v-model="formData.group"
            placeholder="请输入老板所在群聊"
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
  group: string;
}

const userInfo = getUserInfo();
const formData = ref<FormData>({
  store_time: Date.now(),
  amount: '',
  boss: '',
  group:''
});

const reportStore = async () => {
  // 验证必填字段
  if (!formData.value.store_time) {
    message('请选择预存时间', { icon: 'error' });
    return;
  }
  if (!formData.value.amount || isNaN(Number(formData.value.amount)) || Number(formData.value.amount) <= 0) {
    message('请输入有效的预存金额', { icon: 'error' });
    return;
  }
  if (!formData.value.boss) {
    message('请输入老板名字', { icon: 'error' });
    return;
  }

  // 提交数据
  try {
    const response = await httpPost('/report.store', formData.value);
    if (response) {
      message('报备成功', { icon: 'success' });
      Taro.switchTab({ url: '/pages/index/index' }); // 跳转到首页或其他页面
    } else {
      message('报备失败，请稍后重试', { icon: 'error' });
    }
  } catch (error) {
    console.error('报备失败:', error);
    message('报备失败，请稍后重试', { icon: 'error' });
  }
};

onMounted(async () => {
  // 任何你想在组件挂载时执行的逻辑
});
</script>

<style scoped></style>
