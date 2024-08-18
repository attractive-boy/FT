<template>
  <view class="bg-gray-200 min-h-screen content">
    <!-- 搜索栏 -->
    <view class="w-auto rounded-md m-2 px-2 bg-white flex justify-between items-center">
      <nut-input
        type="text"
        v-model="searchQuery"
        placeholder="搜索成员"
      />
    </view>

    <!-- 添加按钮 -->
    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <nut-grid :column-num="2" :clickable="true" :border="false">
        <nut-grid-item text="管理调整积分" @click="navigateTo({ url: '/pages/manage/children/integral/children/index?type=1' })">
          <Dongdong />
        </nut-grid-item>
        <!-- 自行充值积分 -->
        <nut-grid-item text="自行充值积分" @click="navigateTo({ url: '/pages/manage/children/integral/children/index?type=2' })">
          <Dongdong />
        </nut-grid-item>
      </nut-grid>
    </view>

    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <view class="flex justify-between items-center">
        <nut-button type="primary" block @click="exportReport">导出报表</nut-button>
      </view>
    </view>
    

    <div class="bg-white m-2">
      <nut-table class="w-full" :columns="getColumns(getNew)" :data="filteredItemData"></nut-table>
    </div>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref,watch } from "vue";
import { getColumns } from "./columns";
import { navigateTo } from "@tarojs/taro";
import Taro from '@tarojs/taro';
import httpPost from "@/utils/http";
import { Dongdong } from "@nutui/icons-vue-taro";


const itemData = ref([]);
const searchQuery = ref("");
const filteredItemData = ref([]);

onMounted(async () => {
  // Initialization code, if any
  await getNew();
  filteredItemData.value = itemData.value;
});

const exportReport = async () => {
  // 先定义一个字段映射表，将英文字段名映射为中文字段名
  const fieldMapping = {
    nick_name: "昵称",
    register_time:"加入时间",
    points: "积分",
  };

  // 使用字段映射表将 reportList 中的字段名进行转换
  const formattedData = itemData.value.map(item => {
    const newItem = {};
    for (const key in item) {
      if (fieldMapping[key]) {
        newItem[fieldMapping[key]] = item[key];
      }
    }
    return newItem;
  });
  console.log(formattedData)
  const XLSX = require('xlsx')
  // 将转换后的数据导出为 Excel
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

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

// Function to handle navigation
const navigateTo = (options) => {
  Taro.navigateTo(options);
};

const getNew = async () => {
  await httpPost("/user.list.get.all").then((res) => {
    itemData.value = res;
    filteredItemData.value = res;
  });
};

watch(searchQuery, (newQuery) => {
  const query = newQuery.toLowerCase();
  if (query) {
    filteredItemData.value = itemData.value.filter((item) =>
      item.nick_name.toLowerCase().includes(query)
    );
  } else {
    filteredItemData.value = itemData.value;
  }
});
</script>
