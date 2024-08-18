<template>
  <nut-tabbar v-model="activeName" @tab-switch="tabSwitch">
    <nut-tabbar-item
      v-for="item in List"
      :key="item.name"
      :name="item.name"
      :tab-title="item.title"
      :icon="item.icon"
    >
      {{ item.title }}
    </nut-tabbar-item>
  </nut-tabbar>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { Home, My } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';

// 当前激活的 Tab 名称
const activeName = ref('home');

// Tab 列表配置
const List :any = [
  {
    title: '报备',
    pagePath: "/pages/index/index",
    icon: h(Home),
    name: 'home'
  },
  {
    title: '我的',
    pagePath: "/pages/my/index",
    icon: h(My),
    name: 'my'
  }
];

// 处理 Tab 切换
const tabSwitch = (item: any) => {
  
  const pagePath : any = List.find(i => i.name === item.name).pagePath;
  // 切换 Tab 页
  Taro.switchTab({
    url: pagePath,
    success: () => {
      //强制刷新
      Taro.reLaunch({
        url: pagePath,
      });
    },
  });
  // 更新当前激活的 Tab
  activeName.value = item.name;
};
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
