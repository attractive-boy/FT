<template>
  <view class="bg-gray-200 min-h-screen content">
    <SegmentedControl v-model="selectedTab" :tabs="['全部', '本月', '本周', '今日', '范围']" />
    <MyDateRangePicker v-if="selectedTab === 4" v-model="rangedate" />

    <!-- 操作按钮 -->
    <view class="bg-white m-2 p-4 text-right">
      <button @click="exportToExcel">导出 Excel</button>
    </view>

    <!-- 数据表格 -->
    <view class="bg-white m-2">
      <nut-table class="w-full" :columns="columns" :data="data" :summary="summary"></nut-table>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import Taro from '@tarojs/taro';
import httpPost from '@/utils/http';
import MyDateRangePicker from "@/components/TimeRangePicker/index.vue";

// 表格列配置
const columns = ref([
  { title: '消费日期', key: 'create_time', stylecolumn: 'width: 25%', align: 'center' },
  { title: '项目', key: 'project_name', stylecolumn: 'width: 25%', align: 'center' },
  { title: '单价', key: 'unit_price', stylecolumn: 'width: 25%', align: 'center' },
  { title: '数量', key: 'order_count', stylecolumn: 'width: 25%', align: 'center' },
  { title: '接单人', key: 'user_name', stylecolumn: 'width: 25%', align: 'center' },
  { title: '总价', key: 'total', stylecolumn: 'width: 25%', align: 'center' }
]);

const summary = () => {
  return {
    value: ''
  };
};

const data: any = ref([]); // 用于存储表格数据
const selectedTab = ref(0);
const rangedate = ref([]);
const customerName = ref('');
const customerAmount = ref(0);

// 观察选项卡和时间范围的变化
watch([selectedTab, rangedate], () => {
  fetchData();
});

const fetchData = async () => {
  try {
    const id = Taro.getCurrentInstance().router?.params.id;
    const params: any = {
      id,
    };

    if (selectedTab.value === 4 && rangedate.value.length === 2) {
      params.startTime = rangedate.value[0].toISOString();
      params.endTime = rangedate.value[1].toISOString();
    } else {
      // 根据 selectedTab 设置其他时间范围逻辑
      const now = new Date();
      switch (selectedTab.value) {
        case 1: // 本月
          params.startTime = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
          params.endTime = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
          break;
        case 2: // 本周
          const firstDayOfWeek = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1); // 周一为起始日
          params.startTime = new Date(now.setDate(firstDayOfWeek)).toISOString();
          params.endTime = new Date(now.setDate(firstDayOfWeek + 6)).toISOString();
          break;
        case 3: // 今日
          params.startTime = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          params.endTime = new Date(now.setHours(23, 59, 59, 999)).toISOString();
          break;
      }
    }

    const response = await httpPost('/user.consume.list', params);
    data.value = response; // 假设返回的数据结构是数组
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

const exportToExcel = () => {
  const worksheetData = [
    ['FT俱乐部消费账单明细表'],
    [`${customerName.value} 消费后余额: ${customerAmount.value}`],
    ['消费日期', '项目', '单价', '数量', '接单人', '总价'],
    ...data.value.map(item => [
      item.create_time,
      item.project_name,
      item.unit_price,
      item.order_count,
      item.user_name,
      item.total
    ]),
    [`总消费 ${data.value.reduce((total, item) => total + item.total, 0)}`]
  ];

  const XLSX = require('xlsx');
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // 保存文件并分享
  try {
    // 获取文件系统管理器
    const fileSystemManager = Taro.getFileSystemManager();
    const filePath = `${Taro.env.USER_DATA_PATH}/report.xlsx`;

    // 写入文件
    fileSystemManager.writeFile({
      filePath,
      data: excelBuffer,
      encoding: 'binary',
      success: async () => {
        console.log('文件保存成功', filePath);
        // 用户点击分享按钮后调用分享接口
        Taro.showActionSheet({
          itemList: ['分享文件'],
          success: async (res) => {
            if (res.tapIndex === 0) {
              try {
                await Taro.shareFileMessage({
                  filePath
                });
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

// 初次加载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* 自定义样式 */
</style>
