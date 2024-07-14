<style>
.my-divider {
  --nut-divider-line-height: 1px;
}
</style>
<template>
  <view class="min-h-screen bg-gray-200 flex flex-col p-2">
    <!-- 个人、头像、编辑、单价 -->
    <view class="bg-white rounded-md p-2 flex justify-between items-center">
      <nut-avatar shape="square" size="64">
        <img :src="userInfo.avatar_url" />
      </nut-avatar>
      <view class="flex flex-col justify-between items-start h-auto">
        <view class="flex justify-between items-center w-full">
          <text class="text-lg font-bold">{{ userInfo.nick_name }}</text>
          <nut-tag type="danger" plain> 单价：10 </nut-tag>
        </view>
        <text class="text-xs italic text-gray-500"
          >{{
            format(userInfo.register_time * 1000, "yyyy 年 MM 月 dd 日 ")
          }}
          加入 俱乐部</text
        >
      </view>
      <Setting size="22px" />
    </view>
    <!-- 钱包位置 -->
    <nut-cell
      title="我的钱包"
      is-link
      @click="navigateTo({ url: '/pages/my/children/wallet/index' })"
    >
      <template #link>
        <span class="text-rose-500 font-bold">{{ "0.00 元" }}</span>
      </template>
    </nut-cell>
    <!-- 个人陪玩数据信息展示 -->
    <view class="mb-2 bg-white rounded-md p-2">
      <SegmentedControl
        v-model="selectedTab"
        :tabs="['全部', '今日', '本周', '本月', '全部']"
      />
      <view>
        <view class="flex justify-around items-center h-20">
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text>个人收益</text>
            <text class="font-bold text-red-500">0.00</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text>总排名</text>
            <text class="font-bold text-blue-500">1</text>
          </view>
        </view>
        <nut-divider
          class="my-divider"
          :style="{ padding: '0 26px', margin: '0px', height: '1px' }"
        />
        <view class="flex justify-around items-center h-20">
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">接单量</text>
            <text class="font-bold">0.00</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">接单额</text>
            <text class="font-bold">0.00</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">抽成</text>
            <text class="font-bold">0.00</text>
          </view>
        </view>
        <nut-divider
          class="my-divider"
          :style="{ padding: '0 26px', margin: '0px', height: '1px' }"
        />
        <view class="flex justify-around items-center h-20">
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">点单量</text>
            <text class="font-bold">0.00</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">点单额</text>
            <text class="font-bold">0.00</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">返点</text>
            <text class="font-bold">0.00</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 功能区域 -->
    <view class="mb-2 w-auto rounded-md px-2 bg-white">
      <nut-grid :column-num="3" :clickable="true" :border="false">
        <nut-grid-item
          text="会员管理"
          @click="navigateTo({ url: '/pages/my/children/myVip/index' })"
          ><Dongdong
        /></nut-grid-item>
        <nut-grid-item text="版本更新"><Dongdong /></nut-grid-item>
        <nut-grid-item text="其他功能"><Dongdong /></nut-grid-item>
      </nut-grid>
    </view>
    <!-- 管理员 -->
    <view class="w-auto">
      <nut-button
        block
        type="primary"
        plain
        @click="navigateTo({ url: '/pages/manage/index' })"
      >
        管理中心
      </nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Dongdong, Setting } from "@nutui/icons-vue-taro";
import { navigateTo } from "@tarojs/taro";
import SegmentedControl from "@/components/SegmentedControl/index.vue";
import { getUserInfo } from "@/utils/auth";
import { format } from "date-fns";
import { ref } from "vue";

const userInfo = getUserInfo();
const selectedTab = ref(0);
</script>
