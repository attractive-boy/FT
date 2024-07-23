<template>
  <view class="bg-gray-200 min-h-screen content">
    <!-- 搜索栏 -->
    <view class="w-auto rounded-md m-2 px-2 bg-white flex justify-between items-center">
      <nut-input
        type="text"
        v-model="searchQuery"
        placeholder="搜索成员"
      />
    </view>

    <!-- 添加按钮 -->
    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <nut-grid :column-num="2" :clickable="true" :border="false">
        <nut-grid-item text="已退成员管理" @click="navigateTo({ url: '/pages/manage/children/audit/index' })">
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
      <nut-table class="w-full" :columns="getColumns(getNew)" :data="filteredItemData"></nut-table>
    </div>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref,watch } from "vue";
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
const searchQuery = ref("");
const filteredItemData = ref([]);

onMounted(async () => {
  // Initialization code, if any
  await getNew();
  filteredItemData.value = itemData.value;
});

// Function to handle navigation
const navigateTo = (options) => {
  Taro.navigateTo(options);
};

const getNew = async () => {
  await httpPost("/user.list.get.all").then((res) => {
    itemData.value = res;
    filteredItemData.value = res;
  });
};

watch(searchQuery, (newQuery) => {
  const query = newQuery.toLowerCase();
  if (query) {
    filteredItemData.value = itemData.value.filter((item) =>
      item.nick_name.toLowerCase().includes(query)
    );
  } else {
    filteredItemData.value = itemData.value;
  }
});
</script>

