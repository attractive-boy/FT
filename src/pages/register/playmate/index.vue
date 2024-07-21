<template>
  <div class="login-bg flex justify-around items-center flex-col h-screen w-screen bg-no-repeat bg-center bg-cover">
    <div
      class="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-3xl flex justify-around items-center p-3 font-bold text-lg">
      <span>陪玩 - 注册 - 申请</span>
    </div>
    <div
      class="w-4/5 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-3xl flex justify-around flex-col items-center p-3">
      <nut-form>
        <nut-form-item label="头像" :label-width="50">
          <div>
            <div class="avatar-wrapper">
              <nut-avatar size="large" icon="https://via.placeholder.com/150">
                <img :src="formData.avatar_url" />
              </nut-avatar>
            </div>
            <div style="height: 10px;"></div>
            <nut-button plain size="mini" type="primary" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              选择头像
            </nut-button>
          </div>
        </nut-form-item>
        <nut-form-item label="昵称" :label-width="50">
          <nut-input v-model="formData.nick_name" placeholder="请输入姓名" type="nickname" />
        </nut-form-item>
        <nut-form-item label="性别" :label-width="50">
          <nut-radio-group v-model="formData.gender" direction="horizontal">
            <nut-radio label="未知">未知</nut-radio>
            <nut-radio label="男">男</nut-radio>
            <nut-radio label="女">女</nut-radio>
          </nut-radio-group>
        </nut-form-item>
        <nut-form-item label="生日" :label-width="50">
          <nut-button plain size="mini" type="default" @click="showDatePicker">
            {{ format(formData.birthday, "yyyy-MM-dd") }}
          </nut-button>
        </nut-form-item>
        <nut-form-item label="联系电话" :label-width="50">
          <nut-input v-model="formData.phone" placeholder="请输入联系电话" type="tel" />
        </nut-form-item>

      </nut-form>
    </div>
    <div
      class="w-4/5 h-20 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-3xl flex justify-around items-center">
      <nut-button type="default" @click="Taro.navigateBack()">返回登陆</nut-button>
      <nut-button type="success" @click="applyRegister">申请注册</nut-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { format } from "date-fns";
import Taro from "@tarojs/taro";
import httpPost from "@/utils/http";

const formData = reactive({
  avatar_url: "",
  nick_name: "", // 姓名
  gender: "未知", //
  birthday: new Date(2000, 0, 1), // 联系电话
  phone: "",
});

const showDatePicker = () => {
  console.log(1);
};
const applyRegister = async () => {
  const res = await Taro.login();
  if (await httpPost("/apply.register", { ...formData, code: res.code })) {
    Taro.reLaunch({ url: "/pages/index/index" });
  }
};

const onChooseAvatar = (e: any) => {
  const requestUrl = `${process.env.TARO_APP_BASE_URL}/upload.avatar`;
  console.log(requestUrl);
  Taro.uploadFile({
    url: requestUrl,
    filePath: e.detail.avatarUrl,
    name: "file",
    success(res) {
      console.log(res.data);
    },
  });
};

onMounted(async () => {

});
</script>

<style>
.login-bg {
  background-image: url("@/assets/login.svg");
  /* 设置背景图片路径 */
}
</style>
