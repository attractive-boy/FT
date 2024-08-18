<template>
  <div class="flex flex-col justify-between min-h-screen p-4">
    <div class="text-center mb-4">
      <p class="text-xl font-semibold">需要支付{{ amount }}元</p>
    </div>
    <div class="flex-1 flex flex-col items-center">
      <div v-for="(url, index) in imageurl" :key="index" class="w-full aspect-w-16 aspect-h-9 mb-2">
        <img :src="url" class="object-cover w-full" mode="widthFix" />
      </div>
    </div>
    <button class="w-full bg-blue-500 text-white py-2 rounded-md" @click="pay()">完成支付</button>
  </div>
</template>

<script lang="ts" setup>
import httpPost from '@/utils/http';
import { ref, onMounted } from 'vue';
import Taro from '@tarojs/taro';

const amount = ref(0);
const imageurl = ref<string[]>([]);

onMounted(async () => {
  // 获取传递过来的id
  const id = Taro.getCurrentInstance().router?.params.id;
  if (id) {
    try {
      const res = await httpPost('/user.pay.get.byid', { id });
      console.log(res);
      amount.value = res[0].actual_amount;
      const baseUrl = process.env.TARO_APP_OSS;
      imageurl.value = res[0].qrcode_url.split(',').map(item => baseUrl + item);
    } catch (error) {
      console.error("Failed to fetch data", error);
      // Handle error appropriately
    }
  }
});
const pay = async () => {
  await httpPost("/user.payment.update", {
    id: Taro.getCurrentInstance().router?.params.id,
    status: "已领取",
  });
  Taro.navigateBack();
};
</script>

<style scoped>
/* Tailwind CSS Aspect Ratio Plugin for height adjustments */
.aspect-w-16 {
  aspect-ratio: 16 / 9;
}

.aspect-h-9 {
  aspect-ratio: 9 / 16;
}
</style>
