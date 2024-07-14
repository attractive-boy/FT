<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-around">
    <div class="flex flex-col items-center justify-around space-y-5">
      <div>
        <img class="w-16 h-16" :src="Image" />
      </div>
      <span class="font-bold">我的零钱</span>
      <span class="text-4xl font-bold">￥168.60</span>
    </div>
    <div
      style="--nut-button-border-radius: 5px"
      class="flex flex-col items-center justify-around w-1/2 space-y-2"
    >
      <div class="w-full">
        <nut-button
          type="warning"
          block
          @click="
            Taro.navigateTo({
              url: '/pages/my/children/wallet/topUp/index',
            })
          "
          >充值</nut-button
        >
      </div>
      <div class="w-full">
        <nut-button
          type="success"
          block
          @click="
            Taro.navigateTo({
              url: '/pages/my/children/wallet/withdraw/index',
            })
          "
          >提现</nut-button
        >
      </div>
      <div class="w-full">
        <nut-button type="info" block>零钱明细</nut-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Image from "@/assets/gold.png";
import Taro from "@tarojs/taro";
</script>

<style scoped></style>
