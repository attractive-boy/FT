<template>
  <view class="bg-gray-200 min-h-screen content">
    <!-- 添加按钮 -->
    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <nut-grid :column-num="2" :clickable="true" :border="false">
        <nut-grid-item text="成员审核记录" @click="navigateTo({ url: '/pages/manage/children/audit/index' })">
          <Dongdong />
        </nut-grid-item>
        <button open-type="share" style="visibility: hidden;">
          <nut-grid-item text="发送邀请卡片" style="visibility: visible !important;">
            <Dongdong />
          </nut-grid-item>
        </button>
      </nut-grid>
    </view>
    <div class="bg-white m-2">
      <nut-table class="w-full" :columns="getColumns(getNew)" :data="itemData"></nut-table>
    </div>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { getColumns } from "./columns";
import { navigateTo } from "@tarojs/taro";
import Taro from '@tarojs/taro';
import httpPost from "@/utils/http";
import { Dongdong } from "@nutui/icons-vue-taro";

// Use the share options
Taro.useShareAppMessage(() => {
  return {
    title: '邀请卡片',
    imageUrl: 'https://ftbclub.top/oss/app/logo.jpg', // Replace with your card image URL
    path: '/pages/register/playmate/index' // Replace with your card's path or parameters
  }
});

const itemData = ref([]);

onMounted(async () => {
  // Initialization code, if any
  getNew()
});

// Function to handle navigation
const navigateTo = (options) => {
  Taro.navigateTo(options);
};

//获取所有状态为待审核的成员
const getNew = async () => {
  await httpPost("/member.getNew").then((res) => {
    itemData.value = res;
  });
};
</script>

<style scoped>
/* Your styles here */
</style>
