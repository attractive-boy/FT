<template>
  <web-view :src='redirectUri' :onLoad="onLoad" />
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter,redirectTo } from '@tarojs/taro';
import httpPost from "@/utils/http";
const redirectUri = ref('');
const router = useRouter();
const id = ref('');
onMounted(() => {
  httpPost("/find").then((res) => {
    console.log(res);
    // 生成随机数字
    const connect_redirect = Math.floor(Math.random() * 1000000);
    redirectUri.value = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1179af9b80246159&redirect_uri=https://ftbclub.top/api/bind?id=${res}&response_type=code&scope=snsapi_base&state=123&connect_redirect=${connect_redirect}#wechat_redirect`;
  })
});

const onLoad = (e) => {
  //前往主页
  redirectTo({ url: "/pages/login/index" })
}
</script>
  
<style scoped></style>