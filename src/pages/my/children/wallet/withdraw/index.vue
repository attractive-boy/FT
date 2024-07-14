<template>
  <div
    class="h-screen w-full px-2 py-5 flex justify-between items-center flex-col"
  >
    <div class="w-full">
      <nut-form class="w-full">
        <nut-form-item label="金额">
          <nut-input
            v-model="withdraw"
            placeholder="请输入你要提现的金额"
            type="number"
          />
        </nut-form-item>
      </nut-form>
      <div class="flex flex-wrap w-full text-center rounded-md shadow-md mt-5">
        <div class="w-1/3 p-2 flex flex-col item-center space-y-1">
          <div>提现</div>
          <div>{{ withdraw || 0 }}</div>
        </div>
        <div class="w-1/3 p-2 flex flex-col item-center space-y-1">
          <div>余额</div>
          <div>{{ balance || 0 }}</div>
        </div>
        <div class="w-1/3 p-2 flex flex-col item-center space-y-1">
          <div>结余</div>
          <div>{{ (balance || 0) - (withdraw || 0) }}</div>
        </div>
      </div>
    </div>
    <nut-button block type="success">提现</nut-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const withdraw = ref();
const balance = ref(10);
</script>
