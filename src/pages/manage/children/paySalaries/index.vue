<template>
  
  <view class="min-h-screen bg-gray-200 flex flex-col">
    <nut-image-preview :show="state.showPreview" :images="state.imgData" @close="hideFn" />
    <div class="bg-white overflow-x-auto">
      <nut-table style="width: 150%;" :columns="getColumns(getSallaryHistory)" :data="salaries"></nut-table>
    </div>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from 'vue';
import httpPost from '@/utils/http';

import { getColumns } from "./columns";

onMounted(async () => {
  await getSallaryHistory()
});

const salaries = ref([]);
const getSallaryHistory = async () => {
  const result = await httpPost("/user.pay.get.list");
  salaries.value = result;
};

//监控每一行的showqrcode 如果为true 则显示图片预览
watch(
  salaries, 
  (newValue, oldValue) => {
    newValue.forEach((item) => {
      if (item.showqrcode) {
        const baseUrl = process.env.TARO_APP_OSS;
        const qrcodeUrls = item.qrcode_url.split(','); // Split comma-separated URLs
        state.showPreview = true;
        
        state.imgData = qrcodeUrls.map((url) => { return { src: baseUrl + url } });
        console.log(qrcodeUrls.map((url) => { return { src: baseUrl + url } }));
      }
    });
  }, 
  { deep: true }
);


const state = reactive({
  showPreview: false,
  imgData: []
})


const hideFn = () => {
  state.showPreview = false
  salaries.value.forEach((item) => {
    item.showqrcode = false;
  })
}
</script>

<style scoped>
/* Add your scoped styles here */
</style>
