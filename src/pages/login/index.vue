<template>
  <div
    class="login-bg flex justify-around items-center flex-col h-screen w-screen bg-no-repeat bg-center bg-cover"
  >
    <div class="w-4/5 h-20 flex justify-center items-center flex-col">
      <h1
        class="p-2 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-3xl font-bold text-center text-lg"
      >
        欢迎使用 FT 汇报
      </h1>
      <h1 v-if="status === '未注册'" class="text-center font-bold text-sm">
        您还未注册，请选择你的身份开始美妙之旅吧！
      </h1>
    </div>
    <div
      class="w-4/5 aspect-square bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-3xl flex justify-around flex-col items-center"
    >
      <image
        class="w-52 h-52 rounded-full"
        src="https://ftbclub.top/oss/app/logo.jpg"
      ></image>
      <h1 class="text-3xl font-bold text-sky-700">FT 汇报</h1>
    </div>
    <div
      class="w-4/5 h-20 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-3xl flex justify-around items-center"
    >
      <div
        v-if="status === '未注册'"
        class="w-full flex justify-around items-center"
      >
        <nut-button type="info" @click="isPlaymate">我是陪玩</nut-button>
        <nut-button
          type="success"
          @click="message('该功能暂未开通', { icon: 'error' })"
          >我是老板</nut-button
        >
      </div>
      <nut-button v-else-if="status === '待审核'" block loading type="warning">
        等待管理员审批……
      </nut-button>
      <nut-button v-else-if="status === '禁用'" disabled block type="danger">
        您已被管理员禁用，请联系管理员！
      </nut-button>
      <nut-button v-else-if="!status" disabled block type="danger">
        网络连接失败，请检查网络连接！
      </nut-button>
    </div>
  </div>
</template>

<script setup>
import Taro from "@tarojs/taro";
import { message } from "@/utils/message";
import { onMounted, ref } from "vue";
import httpPost from "@/utils/http";
import { setUserInfo } from "@/utils/auth";

const status = ref("未注册");

const isPlaymate = async () => {
  Taro.navigateTo({
    url: `/pages/register/playmate/index`,
  }); // 跳转到陪玩注册页面
};

onMounted(async () => {
  const loginRes = await Taro.login();
  const apiRes = await httpPost("/login", { code: loginRes.code });
  status.value = apiRes.status;

  status.value === "正常" &&
    setUserInfo(apiRes) &&
    Taro.switchTab({ url: "/pages/index/index" });
});
</script>

<style>
.login-bg {
  background-image: url("@/assets/login.svg"); /* 设置背景图片路径 */
}
</style>
