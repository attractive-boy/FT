<template>
  <view class="bg-gray-200 h-screen">
    <!-- 公告 -->
    <nut-noticebar text="欢迎使用 FT 汇报小程序，此处是公告信息位置，请超级管理员发布您的第一条公告！" />
    <!-- 俱乐部标题 -->
    <view class="w-auto rounded-md bg-white p-2 m-2 flex justify-between items-center">
      <nut-avatar shape="round" size="64">
        <img src="https://ftbclub.top/oss/app/logo.jpg" />
      </nut-avatar>

      <view class="flex flex-col justify-between items-end h-auto">
        <view class="text-2xl font-bold">FT 俱乐部</view>
        <view class="text-xs text-gray-400">
          <text>版本号：</text>
          <text class="font-bold">1.0.0</text>
        </view>
      </view>
    </view>
    <!-- 功能区域 -->
    <view class="w-auto rounded-md px-2 m-2 bg-white">
      <nut-grid :column-num="3" :clickable="true" :border="false">
        <nut-grid-item @click="
          navigateTo({ url: '/pages/index/children/reportHistory/index' })
          " text="报备信息">
          <Dongdong />
        </nut-grid-item>
        <nut-grid-item text="快捷报备" @click="quickReport()">
          <Dongdong />
        </nut-grid-item>
        <!-- <nut-grid-item text="预存报备"
          @click="navigateTo({ url: '/pages/index/children/preStore/index' })"
        ><Dongdong /></nut-grid-item> -->
      </nut-grid>
    </view>
    <!-- 报备区域 -->
    <view class="w-auto m-2 flex justify-between items-center">
      <view class="w-1/2 aspect-ratio-5/3 bg-orange-500 mr-1 p-3 rounded-md flex justify-between items-start"
        @click="navigateTo({ url: '/pages/index/children/itemReport/index' })">
        <view class="flex justify-between items-start flex-col h-full">
          <text class="text-white text-xl font-bold">项目单</text>
          <text class="text-white text-lg">Game</text>
        </view>
        <Add color="white" size="46" />
      </view>
      <view class="w-1/2 aspect-ratio-5/2 bg-green-500 ml-1 p-3 rounded-md flex justify-between items-start"
        @click="navigateTo({ url: '/pages/index/children/giftReport/index' })">
        <view class="flex justify-between items-start flex-col h-full">
          <text class="text-white text-xl font-bold">礼物单</text>
          <text class="text-white text-lg">Gift</text>
        </view>

        <Addfollow color="white" size="46" />
      </view>


    </view>

    <view class="w-auto m-2 flex justify-between items-center">
      <view class="w-1/2 aspect-ratio-5/3 bg-orange-500 mr-1 p-3 rounded-md flex justify-between items-start"
        @click="navigateTo({ url: '/pages/index/children/preStore/index' })">
        <view class="flex justify-between items-start flex-col h-full">
          <text class="text-white text-xl font-bold">预存</text>
          <text class="text-white text-lg">Prestore</text>
        </view>
        <Add color="white" size="46" />
      </view>
    </view>
    <!-- 俱乐部榜单 -->
    <view class="w-auto mx-2 bg-white p-3 flex justify-between items-center rounded-md">
      <div class="flex items-center">
        <Star color="blue" size="22px" />
        <text class="text-gray-400 text-lg ml-2">俱乐部榜单</text>
      </div>
      <RectRight color="gray" size="22px" />
    </view>
    <!-- <nut-button @click="addNode">点击</nut-button> -->
  </view>
</template>

<script setup>
import { isLogin } from "@/utils/auth";
import httpPost from "@/utils/http";
import {
  Dongdong,
  Add,
  Addfollow,
  Star,
  RectRight,
} from "@nutui/icons-vue-taro";
import { h, onMounted } from "vue";
import { redirectTo, navigateTo, clearStorageSync } from "@tarojs/taro";

const addNode = async () => {
  await httpPost("///");
};

onMounted(async () => {
  isLogin() || redirectTo({ url: "/pages/login/index" });

  // 定义禁止访问的日期（9月1日）
  const RESTRICTED_DATE = new Date(2024, 8, 1); // 8 表示 9 月（月份从 0 开始）

  // 获取当前日期
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 检查当前日期是否在禁止访问日期之后
  const isAfterRestrictedDate = currentDate > RESTRICTED_DATE;
  console.log("time=>", isAfterRestrictedDate);
  if (isAfterRestrictedDate) {
    navigateTo({ url: '/pages/restricted/index' });
  }

  // 查看是否已经关联公众号
  httpPost("/isBind").then((res) => {
    if (!res.wechat_openid || res.wechat_openid.length < 1) {
      navigateTo({ url: '/pages/bindwx/index' });
    }
    //如果返回401 清除缓存跳转登录
    if (res.code === 401) {
      clearStorageSync();
      navigateTo({ url: '/pages/login/index' });
    }
})
});
const quickReport = () => {
  httpPost("/report.quick").then((res) => {
    const { id, type } = res;
    if (type === 'item') {
      navigateTo({ url: `/pages/index/children/itemReport/index?id=${id}` });
    } else {
      navigateTo({ url: `/pages/index/children/giftReport/index?id=${id}` });
    }
  });
};



</script>
