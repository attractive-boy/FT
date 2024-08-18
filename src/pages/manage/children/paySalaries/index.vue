<template>
  <SegmentedControl v-model="activeKey" :tabs="['未结工资', '已结工资']" />
  <SegmentedControl v-model="selectedTab" :tabs="['全部', '本月', '本周', '今日', '范围']" />
  <MyDateRangePicker v-if="selectedTab == 4" v-model="rangedate" />
  <view class="w-auto rounded-md m-2 px-2 bg-white">
    <view class="flex justify-between items-center">
      <nut-button type="primary" block @click="exportReport">导出报表</nut-button>
    </view>
  </view>
  <view class="min-h-screen bg-gray-200 flex flex-col">
    <nut-image-preview :show="state.showPreview" :images="state.imgData" @close="hideFn" />
    <div class="bg-white overflow-x-auto">
      <nut-table :columns="getColumns(getSallaryHistory)" :data="salaries"></nut-table>
      <nut-pagination
      v-model="currentPage" :total-items="totalItems" :items-per-page="pageSize" @change="fetchData"

      ></nut-pagination>
    </div>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from 'vue';
import httpPost from '@/utils/http';
import Taro from '@tarojs/taro';
import { getColumns } from "./columns";
import MyDateRangePicker from "@/components/TimeRangePicker/index.vue";

// 组件状态
const activeKey = ref(0);
const selectedTab = ref('全部');
const rangedate = ref([new Date(), new Date()]);

const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);

// 薪资数据
const salaries = ref<any[]>([]);

// 获取薪资历史数据
const getSallaryHistory = async () => {
  const params = {
    page: currentPage.value,
    limit: pageSize.value,
    status: activeKey.value,
    filter: selectedTab.value,
    rangedate: selectedTab.value == '4' ? rangedate.value : [] ,
    activeKey: activeKey.value
  };
  const result = await httpPost("/user.pay.get.list1", params);
  console.log(result);
  salaries.value = result.data;
  totalItems.value = result.total;
};

// 导出报表
const exportReport = async () => {
  const formattedData = salaries.value.map(item => ({
    name: item.name,
    actual_amount: item.actual_amount,
    // Add other fields as needed
  }));
  const XLSX = require('xlsx')
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  try {
    const filePath = `${Taro.env.USER_DATA_PATH}/report.xlsx`;
    Taro.getFileSystemManager().writeFile({
      filePath,
      data: excelBuffer,
      encoding: 'binary',
      success: async () => {
        Taro.showActionSheet({
          itemList: ['分享文件'],
          success: async (res) => {
            if (res.tapIndex === 0) {
              try {
                await Taro.shareFileMessage({ filePath });
                Taro.showToast({
                  title: '分享成功',
                  icon: 'success',
                  duration: 2000
                });
              } catch (error) {
                Taro.showToast({
                  title: '分享失败',
                  icon: 'error',
                  duration: 2000
                });
                console.error('分享失败', error);
              }
            }
          },
          fail: (error) => {
            Taro.showToast({
              title: '操作失败',
              icon: 'error',
              duration: 2000
            });
            console.error('操作失败', error);
          }
        });
      },
      fail: (error) => {
        Taro.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 2000
        });
        console.error('文件保存失败', error);
      }
    });
  } catch (error) {
    Taro.showToast({
      title: '操作失败',
      icon: 'error',
      duration: 2000
    });
    console.error('操作失败', error);
  }
};

// 监控每一行的 showqrcode 如果为 true 则显示图片预览
const state = reactive({
  showPreview: false,
  imgData: []
});

watch(
  salaries,
  (newValue) => {
    newValue.forEach((item) => {
      if (item.showqrcode) {
        const baseUrl = process.env.TARO_APP_OSS;
        const qrcodeUrls = item.qrcode_url.split(','); // Split comma-separated URLs
        state.showPreview = true;
        state.imgData = qrcodeUrls.map((url) => ({ src: baseUrl + url }));
      }
    });
  },
  { deep: true }
);

// 隐藏图片预览
const hideFn = () => {
  state.showPreview = false;
  salaries.value.forEach((item) => {
    item.showqrcode = false;
  });
};

// 初始化数据
onMounted(async () => {
  await getSallaryHistory();
});

// 处理数据分页
const fetchData = async (page: number) => {
  currentPage.value = page;
  await getSallaryHistory();
};

// 监听筛选条件变化
watch([activeKey,selectedTab, rangedate], async () => {
  await getSallaryHistory();
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>
