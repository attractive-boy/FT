<template>
  <view class="min-h-screen bg-gray-200 flex flex-col">
    <!-- 俱乐部标题 -->
    <view class="rounded-md w-auto bg-white p-2 m-2 flex justify-between items-center">
      <nut-avatar shape="round" size="64">
        <img src="https://ftbclub.top/oss/app/logo.jpg" />
      </nut-avatar>
      <view class="flex flex-col justify-between items-end h-auto">
        <view class="text-2xl font-bold">FT 俱乐部</view>
        <view class="text-xs text-gray-400">
          <text class="font-bold text-green-700">成员数：{{ statics.memberCount }}</text>
        </view>
      </view>
    </view>
    <!-- 俱乐部数据信息展示 -->
    <view class="mx-2 bg-white rounded-md p-2">
      <SegmentedControl v-model="activeKey" :tabs="['全部', '本月', '上月', '今天', '范围']" />
      <MyDateRangePicker v-if="activeKey == 4" v-model="rangedate" />
      <view>
        <view class="flex justify-around items-center h-20">
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text>俱乐部纯收益</text>
            <text class="font-bold text-red-500">{{ toFixed(statics.clubIncome, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text>税前</text>
            <text class="font-bold text-blue-500">{{ toFixed(statics.totalRevenue, 2) }}</text>
          </view>
        </view>
        <nut-divider class="my-divider" :style="{ padding: '0 26px', margin: '0px', height: '1px' }" />
        <view class="flex h-20">
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">接单/点单额</text>
            <text class="font-bold">{{ toFixed(statics.totalOrderAmount, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">收礼/送礼额</text>
            <text class="font-bold">{{ toFixed(statics.totalGiftAmount, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">总流水</text>
            <text class="font-bold">{{ toFixed(statics.totalRevenue, 2) }}</text>
          </view>
        </view>
        <nut-divider class="my-divider" :style="{ padding: '0 26px', margin: '0px', height: '1px' }" />
        <view class="flex h-20">
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">接单/点单量</text>
            <text class="font-bold">{{ toFixed(statics.totalOrderCount, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">收礼/送礼量</text>
            <text class="font-bold">{{ toFixed(statics.totalGiftCount, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">总单量</text>
            <text class="font-bold">{{ toFixed(statics.totalOrderAndGiftCount, 2) }}</text>
          </view>
        </view>
        <nut-divider class="my-divider" :style="{ padding: '0 26px', margin: '0px', height: '1px' }" />
        <view class="flex h-20">
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">接单/点单抽成</text>
            <text class="font-bold">{{ toFixed(statics.totalOrderCommission, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">收礼/送礼抽成</text>
            <text class="font-bold">{{ toFixed(statics.totalGiftCommission, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">总抽成</text>
            <text class="font-bold">{{ toFixed(statics.totalCommission, 2) }}</text>
          </view>
        </view>
        <nut-divider class="my-divider" :style="{ padding: '0 26px', margin: '0px', height: '1px' }" />
        <view class="flex h-20">
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">接单/点单返点</text>
            <text class="font-bold">{{ toFixed(statics.totalOrderRebate, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">收礼/送礼返点</text>
            <text class="font-bold">{{ toFixed(statics.totalGiftRebate, 2) }}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col w-1/3">
            <text class="text-gray-500">总返点</text>
            <text class="font-bold">{{ toFixed(statics.totalRebate, 2) }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 管理功能区域 -->
    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <nut-grid :column-num="3" :clickable="true" :border="false">
        <nut-grid-item text="项目管理" @click="navigateTo({ url: '/pages/manage/children/items/index' })">
          <Dongdong />
        </nut-grid-item>
        <nut-grid-item text="礼物管理" @click="navigateTo({ url: '/pages/manage/children/gift/index' })">
          <Dongdong />
        </nut-grid-item>
        <nut-grid-item text="报备数据" @click="navigateTo({ url: '/pages/manage/children/report/index' })">
          <Dongdong />
        </nut-grid-item>
        <nut-grid-item text="邀请成员" @click="navigateTo({ url: '/pages/manage/children/invite/index' })">
          <Dongdong />
        </nut-grid-item>
        <!-- 成员管理 -->
        <nut-grid-item text="成员管理" @click="navigateTo({ url: '/pages/manage/children/member/index' })">
          <Dongdong />
        </nut-grid-item>
        <!-- 积分管理 -->
        <nut-grid-item text="积分管理" @click="navigateTo({ url: '/pages/manage/children/integral/index' })">
          <Dongdong />
        </nut-grid-item>
        <nut-grid-item text="发工资" @click="navigateTo({ url: '/pages/manage/children/paySalaries/index' })">
          <Dongdong />
        </nut-grid-item>
      </nut-grid>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Dongdong } from "@nutui/icons-vue-taro";
import { navigateTo } from "@tarojs/taro";
import SegmentedControl from "@/components/SegmentedControl/index.vue";
import { onMounted, ref, watch } from "vue";
import Taro from "@tarojs/taro";
import { toFixed } from "@/utils/toFixed";
import httpPost from "@/utils/http";
import { format } from "date-fns";
const activeKey = ref(0);



onMounted(() => {
  // 定义禁止访问的日期（9月1日）
  const RESTRICTED_DATE = new Date(2024, 8, 1); // 8 表示 9 月（月份从 0 开始）

  // 获取当前日期
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 检查当前日期是否在禁止访问日期之后
  const isAfterRestrictedDate = currentDate > RESTRICTED_DATE;
  if (isAfterRestrictedDate) {
    Taro.navigateTo({ url: '/pages/restricted/index' });
  }
});

const statics: any = ref({});
const rangedate = ref([format(new Date(2024, 0, 1), "yyyy-MM-dd"), format(new Date(), "yyyy-MM-dd")]);
// 监听rangedate的变化
watch(rangedate, async (newValue: any) => {
  statics.value = await httpPost('/club.statics', {
    startTime: newValue[0],
    endTime: newValue[1],
  })
});
const startTime = ref(format(new Date(2024, 0, 1), "yyyy-MM-dd"));
const endTime = ref(format(new Date(), "yyyy-MM-dd"));
//根据时间范围 查看个人统计
watch(activeKey, async (newValue: any) => {

  switch (newValue) {
    case 0:
      //全部 获取 2024 - 2100年之间的
      startTime.value = format(new Date(2024, 0, 1), "yyyy-MM-dd");
      endTime.value = format(new Date(2100, 0, 1), "yyyy-MM-dd");
      statics.value = await httpPost('/club.statics', { startTime: startTime.value, endTime: endTime.value })
      break;
    case 1:
      //本月
      startTime.value = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");
      endTime.value = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), "yyyy-MM-dd");
      statics.value = await httpPost('/club.statics', { startTime: startTime.value, endTime: endTime.value })
      break;
    case 2:
      // 本周
      startTime.value = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()), "yyyy-MM-dd");
      endTime.value = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay() + 6), "yyyy-MM-dd");
      statics.value = await httpPost('/club.statics', { startTime: startTime.value, endTime: endTime.value })
      break;
    case 3:
      // 今日
      startTime.value = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd");
      endTime.value = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd");
      statics.value = await httpPost('/club.statics', { startTime: startTime.value, endTime: endTime.value })
      break;
    case 4:
      break;
    default:
      //全部 获取 2024 - 2100年之间的
      startTime.value = format(new Date(2024, 0, 1), "yyyy-MM-dd");
      endTime.value = format(new Date(2100, 0, 1), "yyyy-MM-dd");
      statics.value = await httpPost('/club.statics', { startTime: startTime.value, endTime: endTime.value })
      break;
  }
});

onMounted(async () => {
  startTime.value = format(new Date(2024, 0, 1), "yyyy-MM-dd");
  endTime.value = format(new Date(2100, 0, 1), "yyyy-MM-dd");
  statics.value = await httpPost('/club.statics', { startTime: startTime.value, endTime: endTime.value })

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
});

</script>
