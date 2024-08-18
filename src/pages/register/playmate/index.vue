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
          <nut-input v-model="formData.nick_name" placeholder="请输入昵称" type="nickname" @blur="onBlur" />
        </nut-form-item>
        <nut-form-item label="性别" :label-width="50">
          <nut-radio-group v-model="formData.gender" direction="horizontal">
            <nut-radio label="男">男</nut-radio>
            <nut-radio label="女">女</nut-radio>
          </nut-radio-group>
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
import { reactive } from "vue";
import Taro from "@tarojs/taro";
import httpPost from "@/utils/http";

// 定义表单数据
const formData = reactive({
  avatar_url: "",
  nick_name: "", // 姓名
  gender: "未知", // 性别
  phone: "", // 联系电话
});

// 显示日期选择器的函数（未使用）
const showDatePicker = () => {
  console.log(1);
};

// 提交注册申请的函数
const applyRegister = async () => {
  // 验证所有字段
  if (!formData.avatar_url) {
    Taro.showToast({ title: '请上传头像', icon: 'none' });
    return;
  }
  if (!formData.nick_name) {
    Taro.showToast({ title: '请输入昵称', icon: 'none' });
    return;
  }
  if (formData.gender === "未知") {
    Taro.showToast({ title: '请选择性别', icon: 'none' });
    return;
  }
  if (!formData.phone) {
    Taro.showToast({ title: '请输入联系电话', icon: 'none' });
    return;
  }

  try {
    const res = await Taro.login();
    console.log(formData);
    const result = await httpPost("/apply.register", { ...formData, code: res.code });
    Taro.reLaunch({ url: "/pages/index/index" });
    // if (result.success) {
     
    // } else {
    //   Taro.showToast({ title: '注册失败', icon: 'none' });
    // }
  } catch (error) {
    // Taro.showToast({ title: '注册失败', icon: 'none' });
    console.error('注册失败:', error);
  }
};

// 处理选择头像的函数
const onChooseAvatar = (e: any) => {
  const requestUrl = `${process.env.TARO_APP_BASE_URL}/upload.avatar`;
  console.log(requestUrl);
  Taro.uploadFile({
    url: requestUrl,
    filePath: e.detail.avatarUrl,
    name: "file",
    success(res) {
      formData.avatar_url = `${process.env.TARO_APP_OSS}${res.data}`;
    },
  });
};

// 处理昵称输入框失去焦点事件
const onBlur = (e: any) => {
  formData.nick_name = e.detail.value;
};
</script>

<style>
.login-bg {
  background-image: url("@/assets/login.svg");
  /* 设置背景图片路径 */
}
</style>
