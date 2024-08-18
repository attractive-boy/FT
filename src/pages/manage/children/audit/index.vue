<template>
  <view class="bg-gray-200 min-h-screen content">
    <!-- 添加按钮 -->
    <SegmentedControl v-model="selectedTab" :tabs="['全部', '本月', '本周', '今日', '范围']" />
    <div class="bg-white m-2">
      <nut-table class="w-full" :columns="getColumns(getNew)" :data="itemData"></nut-table>
    </div>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import Taro from '@tarojs/taro';
import httpPost from "@/utils/http";
import { getColumns } from "./columns";
import { MyDateRangePicker } from "@/components/MyDateRangePicker"; // 假设你有这个组件

// 状态管理
const selectedTab = ref('全部');
const rangedate = ref([]);
const itemData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);

// 查询审核记录的函数
const fetchRecords = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      status: selectedTab.value,
      filter: selectedTab.value,
      rangedate: rangedate.value.join(',')
    };
    const result = await httpPost("/user.getApprovalRecords", params);
    itemData.value = result.records;  // 更新数据
    totalItems.value = result.total;  // 更新总记录数
  } catch (error) {
    
    console.error('查询失败:', error);
  }
};

// 监听选项变化，自动查询
watch([selectedTab, rangedate, currentPage, pageSize], fetchRecords, { immediate: true });

// 初始化
onMounted(() => {
  fetchRecords();
});
</script>


<style scoped>
/* Your styles here */
</style>
