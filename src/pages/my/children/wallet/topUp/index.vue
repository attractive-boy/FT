<template>
  <div
    class="bg-gray-100 h-screen w-full px-2 py-5 flex justify-between items-center flex-col"
  >
    <div class="w-full">
      <nut-form class="w-full">
        <nut-form-item label="金额">
          <nut-input
            v-model.number="topUp"
            placeholder="请输入你要充值的金额"
            type="number"
          />
        </nut-form-item>
      </nut-form>
      <div
        class="bg-white text-rose-400 font-bold w-full rounded-md shadow-lg mt-5 h-10 leading-10 text-center"
      >
        仅支持充值整数，请不要充值小于1元的金额！
      </div>
      <div
        class="bg-white flex flex-wrap w-full text-center rounded-md shadow-lg mt-5"
      >
        <div class="w-1/3 p-2 flex flex-col item-center space-y-1">
          <div>充值</div>
          <div>{{ topUp || 0 }}</div>
        </div>
        <div class="w-1/3 p-2 flex flex-col item-center space-y-1">
          <div>余额</div>
          <div>{{ balance || 0 }}</div>
        </div>
        <div class="w-1/3 p-2 flex flex-col item-center space-y-1">
          <div>结余</div>
          <div>{{ (topUp || 0) + (balance || 0) }}</div>
        </div>
      </div>
    </div>
    <nut-number-keyboard
      :visible="true"
      v-model="num"
      type="rightColumn"
      overlay
      :custom-key="customKey"
      confirm-text="支付"
      @confirm="topUpPay"
    >
    </nut-number-keyboard>
  </div>
</template>

<script setup lang="ts">
import httpPost from "@/utils/http";
import { message } from "@/utils/message";
import Taro from "@tarojs/taro";
import { computed, ref } from "vue";

const topUp = ref();
const balance = ref(10);
const customKey = ref(["10"]);

const num = computed({
  get: () => String(topUp.value || 0),
  set: (newValue) => {
    topUp.value = Number(newValue); // 计算属性的setter设置响应式数据的值
  },
});
const topUpPay = async () => {
  const options = await httpPost("/pay", {
    desc: "从前",
    total: Number(topUp.value),
  });
  console.log(options);

  Taro.requestPayment({
    ...options.data,
    success: async () => {
      if (
        await httpPost("/pay.logs", {
          amount: topUp.value,
          type: "充值",
        })
      ) {
        Taro.switchTab({ url: "/pages/index/index" });
      }
    },
    fail() {
      message("支付失败", { icon: "error" });
    },
  });
};
</script>
