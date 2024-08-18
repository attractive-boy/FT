<template>
  <view class="bg-gray-200 min-h-screen content">
    <SegmentedControl v-model="selectedTab" :tabs="['全部', '本月', '本周', '今日', '范围']" />
    <MyDateRangePicker v-if="selectedTab === 4" v-model="rangedate" />
    <view class="w-auto rounded-md m-2 px-2 bg-white flex justify-between items-center">
      <nut-input
        type="text"
        v-model="searchQuery"
        placeholder="搜索成员"
        @input="fetchData"
      />
    </view>
    <!-- 累计统计信息 -->
    <view class="bg-white m-2 p-4 flex justify-between">
      <view>累计充值: {{ totalRecharge }}</view>
      <view>累计扣除: {{ totalDeduction }}</view>
    </view>

    <!-- 操作按钮 -->
    <view class="bg-white m-2 p-4 text-right">
      <button @click="exportToExcel">导出 Excel</button>
    </view>

    <!-- 数据表格 -->
    <view class="bg-white m-2">
      <nut-table class="w-full" :columns="columns" :data="data" :summary="summary"></nut-table>
    </view>

    <!-- 分页组件 -->
    <view class="pagination-container">
      <nut-pagination
        v-model="currentPage"
        :total-items="totalItems"
        :page-size="pageSize"
        @change="fetchData"
      />
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
  { title: '序号', key: 'index', stylecolumn: 'width: 25%', align: 'center' },
  { title: '时间', key: 'transaction_time', stylecolumn: 'width: 25%', align: 'center' },
  { title: '操作人', key: 'operator', stylecolumn: 'width: 25%', align: 'center' },
  { title: '接收人', key: 'recipient', stylecolumn: 'width: 25%', align: 'center' },
  { title: '说明', key: 'notes', stylecolumn: 'width: 25%', align: 'center' },
  { title: '积分', key: 'points', stylecolumn: 'width: 25%', align: 'center' }
]);

const summary = () => {
  return {
    value: ''
  };
};

const data: any = ref([]); // 用于存储表格数据
const searchQuery = ref(''); // 搜索查询
const totalRecharge = ref(0); // 累计充值
const totalDeduction = ref(0); // 累计扣除
const selectedTab = ref(0);
const rangedate = ref([]);
const customerName = ref('');
const customerAmount = ref(0);

// 分页相关
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);

// 观察选项卡、时间范围、搜索查询和当前页码的变化
watch([selectedTab, rangedate, currentPage, searchQuery], () => {
  fetchData();
});

const fetchData = async () => {
  try {
    const id = Taro.getCurrentInstance().router?.params.id;
    const type = Taro.getCurrentInstance().router?.params.type;
    const params: any = {
      id,
      page: currentPage.value,
      pageSize: pageSize.value,
      searchQuery: searchQuery.value, // 添加搜索查询参数
      type // 传递查询类型
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

    const response = await httpPost('/api/transaction-records', params); // 新的请求地址
    data.value = response.records; // 更新表格数据
    totalItems.value = response.total; // 更新总记录数

    // 更新累计统计信息
    totalRecharge.value = response.totalRecharge;
    totalDeduction.value = response.totalDeduction;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

const exportToExcel = () => {
  const worksheetData = [
    ['序号', '时间', '操作人', '接收人', '说明', '积分'],
    ...data.value.map((item, index) => [
      index + 1,                    // 序号
      item.transaction_time,        // 时间
      item.operator,                // 操作人
      item.recipient,               // 接收人
      item.notes,                   // 说明
      item.points                   // 积分
    ])
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
  const type = Taro.getCurrentInstance().router?.params.type;
  if (type === '1') {
    Taro.setNavigationBarTitle({
      title: '管理调整积分记录'
    });
  } else {
    Taro.setNavigationBarTitle({
      title: '自行充值积分记录'
    });
  }
  fetchData();
});
</script>

<style scoped>
/* 自定义样式 */
.pagination-container {
  margin-top: 20px;
  text-align: center;
}
</style>
