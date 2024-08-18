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
    //获取老板的余额以及名称
    const boss = await httpPost('/boss.get', { id });
    customerName.value = boss.name;
    customerAmount.value = boss.amount;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

// Main export function
const exportToExcel = async () => {
  const ExcelJs = require('exceljs');
  // Create a new workbook and worksheet
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet('消费账单');

  // Define worksheet data
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
    ['', '', '', '', `总消费${data.value.reduce((total, item) => total + item.total, 0)}`, ``] // Total Consumption Row
  ];

  // Add rows to the worksheet
  worksheet.addRows(worksheetData);

  // Merge cells
  worksheet.mergeCells('A1:F1'); // Title
  worksheet.mergeCells('A2:F2'); // Subtitle
  worksheet.mergeCells(`E${worksheetData.length}:F${worksheetData.length}`); // Total Consumption

  // Define styles
  const titleStyle = {
    font: { bold: true, size: 16, color: { argb: 'FF000000' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } },
    border: {
      bottom: { style: 'thin', color: { argb: 'FF000000' } }
    }
  };

  const subtitleStyle = {
    font: { italic: true, size: 14, color: { argb: 'FF555555' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } }
  };

  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    }
  };

  const totalStyle = {
    font: { bold: true, size: 14, color: { argb: 'FF000000' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAD1D1' } },
    border: {
      top: { style: 'thin', color: { argb: 'FF000000' } }
    }
  };

  // Apply styles
  worksheet.getCell('A1').style = titleStyle; // Title
  worksheet.getCell('A2').style = subtitleStyle; // Subtitle

  // Apply header styles
  for (let i = 1; i <= 6; i++) {
    worksheet.getCell(3, i).style = headerStyle; // Header Row
  }

  // Apply total consumption style
  worksheet.getCell(`E${worksheetData.length}`).style = totalStyle;
  worksheet.getCell(`F${worksheetData.length}`).style = totalStyle;

  // Set column widths
  worksheet.columns = [
    { width: 20 }, // 消费日期
    { width: 15 }, // 项目
    { width: 10 }, // 单价
    { width: 10 }, // 数量
    { width: 15 }, // 接单人
    { width: 10 }  // 总价
  ];

  // Generate and save the Excel file
  workbook.xlsx.writeBuffer().then(uint8Array => {
    // Save the file
    let u8array = new Uint8Array(uint8Array.length);

    u8array.set(uint8Array.subarray(0,uint8Array.length),0);

    const buffer = u8array.buffer
  try {
    const fileSystemManager = Taro.getFileSystemManager();
    // const filePath = `${Taro.env.USER_DATA_PATH}/report.xlsx`;
    // 使用年-月-日 老板名称
    const filePath = `${Taro.env.USER_DATA_PATH}/${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${customerName.value}.xlsx`;

    fileSystemManager.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success: async () => {
        console.log('文件保存成功', filePath);
        // Show action sheet for sharing
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

  });
  
};
// 初次加载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* 自定义样式 */
</style>
