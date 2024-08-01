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
          <!-- <nut-tag type="danger" plain> 单价：10 </nut-tag> -->
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
    <br>
    <!-- 个人陪玩数据信息展示 -->
    <view class="mb-2 bg-white rounded-md p-2">
      <SegmentedControl
        v-model="selectedTab"
        :tabs="['全部', '本月', '本周' ,'今日', '范围']"
      />
      <view>
        <view class="flex justify-around items-center h-20">
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text>个人收益</text>
            <text class="font-bold text-red-500">{{toFixed(statics.income,2)}}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text>剩余积分</text>
            <text class="font-bold text-blue-500">{{toFixed(statics.balance,2)}}</text>
          </view>
        </view>
        <nut-divider
          class="my-divider"
          :style="{ padding: '0 26px', margin: '0px', height: '1px' }"
        />
        <view class="flex justify-around items-center h-20">
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">接单量</text>
            <text class="font-bold">{{toFixed(statics.reportCount,2)}}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">接单额</text>
            <text class="font-bold">{{toFixed(statics.reportAmount,2)}}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">抽成</text>
            <text class="font-bold">{{toFixed(statics.reportTotal,2)}}</text>
          </view>
        </view>
        <nut-divider
          class="my-divider"
          :style="{ padding: '0 26px', margin: '0px', height: '1px' }"
        />
        <view class="flex justify-around items-center h-20">
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">点单量</text>
            <text class="font-bold">{{toFixed(statics.orderCount,2)}}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">点单额</text>
            <text class="font-bold">{{toFixed(statics.orderAmount,2)}}</text>
          </view>
          <view class="flex justify-around h-7/10 items-center flex-col">
            <text class="text-gray-500">返点</text>
            <text class="font-bold">{{toFixed(statics.commissionTotal,2)}}</text>
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
        <nut-grid-item text="积分充值"
          @click="navigateTo({ url: '/pages/my/children/myIntegral/index' })"
        ><Dongdong /></nut-grid-item>
        <nut-grid-item text="领工资"
        @click="navigateTo({ url: '/pages/my/children/mySalary/index' })"
        ><Dongdong /></nut-grid-item>
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
import { ref, watch } from "vue";
import httpPost from "@/utils/http";
import { toFixed } from "@/utils/toFixed";
const userInfo = getUserInfo();
const selectedTab = ref(0);
const statics = ref({
  income: 0,
  balance: 0,
  reportCount: 0,
  reportAmount: 0,
  reportTotal:0,
  orderCount: 0,
  orderAmount: 0,
  commissionTotal:0,
});
//根据时间范围 查看个人统计
watch(selectedTab, async (newValue:any) => {
    let startTime;
    let endTime;
    switch (newValue) {
        case 0:
            //全部 获取 2024 - 2100年之间的
            startTime = format(new Date(2024, 0, 1), "yyyy-MM-dd");
            endTime = format(new Date(2100, 0, 1), "yyyy-MM-dd");
            statics.value = await httpPost( '/user.statics', { startTime, endTime })
            break;
        case 1:
            //本月
            startTime = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");
            endTime = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), "yyyy-MM-dd");
            statics.value = await httpPost( '/user.statics', { startTime, endTime })
            break;
        case 2:
            // 本周
            startTime = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()), "yyyy-MM-dd");
            endTime = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay() + 6), "yyyy-MM-dd");
            statics.value = await httpPost( '/user.statics', { startTime, endTime })
            break;
        case 3:
            // 今日
            startTime = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd");
            endTime = format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd");
            statics.value = await httpPost( '/user.statics', { startTime, endTime })
            break;
        case 4:
            // 范围
            startTime = format(new Date(2024, 0, 1), "yyyy-MM-dd");
            endTime = format(new Date(2100, 0, 1), "yyyy-MM-dd");
            statics.value = await httpPost( '/user.statics', { startTime, endTime })
            break;
        default:
            //全部 获取 2024 - 2100年之间的
            startTime = format(new Date(2024, 0, 1), "yyyy-MM-dd");
            endTime = format(new Date(2100, 0, 1), "yyyy-MM-dd");
            statics.value = await httpPost( '/user.statics', { startTime, endTime })
            break;
    }
});
</script>
