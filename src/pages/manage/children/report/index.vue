<template>
  <view class="min-h-screen bg-gray-200 flex flex-col">
    <view class="mx-2 bg-white rounded-md p-2" style="margin-top: .5rem;">
      <SegmentedControl
        v-model="activeKey"
        :tabs="['全部', '今日', '本周', '本月', '自定义']"
      />
      <view v-if="activeKey === 4">
        <nut-form>
          <MyDatePickerCell
            title="开始时间"
            v-model="formData.start_time"
            type="datetime"
            :is-show-chinese="true"
          />
          <MyDatePickerCell
            title="结束时间"
            v-model="formData.end_time"
            type="datetime"
            :is-show-chinese="true"
          />
          <!-- 接单人 -->
          <MyPickerCell
            title="接单人"
            v-model="formData.user_id"
            :field-names="{ text: 'nick_name', value: 'id' }"
            :columns="userList"
          >
            <template #top>
              <nut-searchbar
                placeholder="此处可以搜索成员昵称"
                v-model="queryStringForUser"
                @search="getUserList"
              ></nut-searchbar>
            </template>
          </MyPickerCell>
          <!-- 归属人 -->
          <MyPickerCell
            title="归属人"
            v-model="formData.belonged_id"
            :field-names="{ text: 'nick_name', value: 'id' }"
            :columns="userList"
          >
            <template #top>
              <nut-searchbar
                placeholder="此处可以搜索成员昵称"
                v-model="queryStringForUser"
                @search="getUserList"
              ></nut-searchbar>
            </template>
          </MyPickerCell>
          <!-- 老板 -->
          <nut-form-item label="老板名字">
            <nut-input
              v-model="formData.boss"
              placeholder="请输入老板微信昵称或游戏ID"
              type="text"
            />
          </nut-form-item>
          <!-- 显示审核被拒绝的设备 -->
          <nut-form-item label="显示审核被拒绝的设备">
            <nut-switch v-model="formData.show_rejected_devices" />
          </nut-form-item>
          <!-- 显示审核待处理的设备 -->
          <nut-form-item label="显示审核待处理的设备">
            <nut-switch v-model="formData.show_pending_devices" />
          </nut-form-item>
          <!-- 报备类型 -->
          <MyPickerCell
            title="报备类型"
            v-model="formData.report_type"
            :field-names="{ text: 'name', value: 'id' }"
            :columns="reportTypeList"
          />
          <nut-form-item>
            <nut-button type="primary" block @click="getReportList">开始搜索</nut-button>
          </nut-form-item>
        </nut-form>
      </view>
      <view v-else>
        <!-- 搜索框 可以选择是搜索接单人还是点单人 -->
        <view class="flex items-center mb-2">
          <view @click="handleSearchTypeChange" style="font-size: small;white-space: nowrap;">{{ searchType }}</view>
          <nut-searchbar
            class="ml-2"
            :placeholder="searchPlaceholder"
            v-model="queryString"
            @search="getReportList"
          ></nut-searchbar>
        </view>
      </view>
    </view>
    <!-- 管理功能区域 -->
    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <view class="flex justify-between items-center">
        <nut-button type="primary" block @click="exportReport">导出报表</nut-button>
      </view>
    </view>
    <!-- 卡片展示搜索结果 可以有按钮切换下一张 -->
    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <view v-for="item in reportList" :key="item.id" class="p-2 border-b border-gray-200">
        <!-- 接单人 -->
        <nut-form>
          <nut-form-item label="接单人">{{ item.user_name }}</nut-form-item>
          <!-- 所属人 -->
          <nut-form-item label="所属人">{{ item.belonged_name }}</nut-form-item>
          <!-- 老板 -->
          <nut-form-item label="老板">{{ item.boss }}</nut-form-item>
          <!-- 数量 -->
          <nut-form-item label="数量">{{ item.order_count }}</nut-form-item>
          <nut-form-item label="单价">{{ item.unit_price }}</nut-form-item>
          <nut-form-item label="总价">￥{{ item.order_count * item.unit_price }}</nut-form-item>
          <nut-form-item label="状态">{{ item.status }}</nut-form-item>

          <nut-form-item label="开始时间">{{ item.start_time }}</nut-form-item>

          <nut-form-item label="类型">{{ item.type }}</nut-form-item>

        </nut-form>
      </view>
      <view class="flex justify-between items-center p-2">
        <nut-button type="default" @click="previousPage" :disabled="currentPage === 1">上一页</nut-button>
        <text>第 {{ currentPage }} 页，共 {{ totalPages }} 页</text>
        <nut-button type="default" @click="nextPage" :disabled="currentPage === totalPages">下一页</nut-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { navigateTo } from '@tarojs/taro';
import SegmentedControl from '@/components/SegmentedControl/index.vue';
import MyDatePickerCell from '@/components/MyComponents/MyDatePickerCell.vue';
import MyPickerCell from '@/components/MyComponents/MyPickerCell.vue';
import httpPost from '@/utils/http';
import Taro from '@tarojs/taro';

const searchType = ref('接单人');
const searchPlaceholder = ref('搜索接单人');
const activeKey = ref(0);
const userList = ref([]);
const reportTypeList = ref([
  { name: '全部', id: '1' },
  { name: '项目单', id: '2' },
  { name: '礼物单', id: '3' },
]);
const reportList = ref([]);
const queryStringForUser = ref('');
const queryString = ref('');
const currentPage = ref(1);
const totalPages = ref(1);

const formData = ref({
  start_time: Date.now(),
  end_time: Date.now(),
  user_id: '',
  belonged_id: '',
  boss: '',
  show_rejected_devices: false,
  show_pending_devices: false,
  report_type: ''
});

const getUserList = async () => {
  userList.value = await httpPost('/user.list.get', {
    queryString: queryStringForUser.value,
  });
};

const getReportList = async (page = 1) => {
  const response = await httpPost('/report.manager.list.get', {
    ...formData.value,
    queryString: queryString.value,
    activeKey: activeKey.value,
    searchType: searchType.value,
    page,
  });
  console.log( "response==>",response);
  reportList.value = response.data;
  currentPage.value = response.currentPage;
  totalPages.value = response.totalPages;
};

const handleSearchTypeChange = () => {
  searchType.value = searchType.value === '接单人' ? '点单人' : '接单人';
  searchPlaceholder.value = searchType.value === '接单人' ? '搜索接单人' : '搜索点单人';
  queryString.value = ''; // Clear search query when type changes
};

const exportReport = async () => {
  const response = await httpPost('/report.manager.list.get', {
    ...formData.value,
    queryString: queryString.value,
    activeKey: activeKey.value,
    searchType: searchType.value,
    page:1,
    pageSize: 1000000,
  });
  // 先定义一个字段映射表，将英文字段名映射为中文字段名
  const fieldMapping = {
    user_name: '接单人',
    belonged_name: '所属人',
    boss: '老板',
    order_count: '数量',
    unit_price: '单价',
    total_price: '总价',
    status: '状态',
    start_time: '开始时间',
    type: '类型',
  };

  // 使用字段映射表将 reportList 中的字段名进行转换
  const formattedData = response.data.map(item => {
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

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    getReportList(currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    getReportList(currentPage.value);
  }
};

// Watch for changes in activeKey to trigger report list fetch
watch(activeKey, (newValue) => {
  getReportList();
});

onMounted(async () => {
  await getUserList();
  await getReportList();
});
</script>

<style scoped>
/* Add your scoped styles here */
</style>
