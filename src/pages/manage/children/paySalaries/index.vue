<template>
  <view class="min-h-screen bg-gray-200 flex flex-col">
    <view class="mx-2 bg-white rounded-md p-2" style="margin-top: .5rem;">
      <nut-form>
        <MyDatePickerCell title="开始时间" v-model="formData.start_time" type="datetime" :is-show-chinese="true" />
        <MyDatePickerCell title="结束时间" v-model="formData.end_time" type="datetime" :is-show-chinese="true" />
        <!-- 排除成员 -->
        <nut-form-item label="排除成员">
          <nut-popup v-model:visible="showUserSelect" position="bottom">
              <nut-searchbar placeholder="此处可以搜索成员昵称" v-model="queryStringForUser" @search="getUserList"></nut-searchbar>
              <nut-checkbox-group v-model="formData.exclude">
              <nut-checkbox style="width: 100%;margin-bottom: 20px;" v-for="(item, index) in userList" :key="item.id" :label="item.nick_name"
                >{{ item.id }}</nut-checkbox>
              </nut-checkbox-group>
            <button @click="showUserSelect = false">确定</button>
          </nut-popup>
          <span @click="showUserSelect = true">已选择{{ formData.exclude.length }}个成员</span>
        </nut-form-item>
        <!-- 高级筛选 -->
        <!-- <nut-form-item label="高级筛选">
          <span @click="moreSelect">请选择</span>
        </nut-form-item> -->
        <!-- 选择项目 -->
        <nut-form-item label="选择项目">
          <nut-popup v-model:visible="showItemSelect" position="bottom">
              <nut-searchbar placeholder="此处可以搜索项目名称" v-model="queryStringForItem" @search="getItemList"></nut-searchbar>
              <nut-checkbox-group v-model="formData.items">
              <nut-checkbox style="width: 100%;margin-bottom: 20px;" v-for="(item, index) in itemData" :key="item.id" :label="item.name"
                >{{ item.id }}</nut-checkbox>
              </nut-checkbox-group>
            <button @click="showItemSelect = false">确定</button>
          </nut-popup>
          <span @click="showItemSelect = true">已选择{{ formData.items.length == 0? '全部' : formData.items.length + '个' }}项目</span>
        </nut-form-item>
        <!-- 选择礼物 -->
        <nut-form-item label="选择礼物">
          <nut-popup v-model:visible="showGiftSelect" position="bottom">
              <nut-searchbar placeholder="此处可以搜索礼物名称" v-model="queryStringForGift" @search="getGiftList"></nut-searchbar>
              <nut-checkbox-group v-model="formData.gifts">
              <nut-checkbox style="width: 100%;margin-bottom: 20px;" v-for="(item, index) in giftData" :key="item.id" :label="item.name"
                >{{ item.id }}</nut-checkbox>
              </nut-checkbox-group>
              <button @click="showGiftSelect = false">确定</button>
          </nut-popup>
          <span @click="showGiftSelect = true">已选择{{ formData.gifts.length == 0? '全部' : formData.gifts.length + '个' }}礼物</span>
        </nut-form-item>
        <nut-form-item>
          <nut-button type="primary" block @click="getReportList">创建工资单</nut-button>
        </nut-form-item>
      </nut-form>
    </view>
    <!-- 管理功能区域 -->
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
import { ref, onMounted, watch } from 'vue';
import { navigateTo } from '@tarojs/taro';
import SegmentedControl from '@/components/SegmentedControl/index.vue';
import MyDatePickerCell from '@/components/MyComponents/MyDatePickerCell.vue';
import MyPickerCell from '@/components/MyComponents/MyPickerCell.vue';
import httpPost from '@/utils/http';
import Taro from '@tarojs/taro';
import { showActionSheet } from '@/components/MyActionSheet';
import ItemForm from "./ItemForm.vue";
import { getColumns } from "./columns";

const showUserSelect = ref(false);
const showItemSelect = ref(false);
const queryStringForItem = ref('');
const queryStringForUser = ref('');
const showGiftSelect = ref(false);
const queryStringForGift = ref('');
onMounted(async () => {
  await getUserList();
  await getItemList();
  await getGiftList();
});
const getItemList = async () => {
  const result = await httpPost("/item.get.search", {
    queryString: queryStringForItem.value,
  })
  itemData.value = result;
};
const itemData = ref([]);

const getGiftList = async () => {
  const result = await httpPost("/gift.get.search", {
    queryString: queryStringForGift.value,
  })
  giftData.value = result;
};
const giftData = ref([]);
const moreSelect = () => {
  showActionSheet({
    title: "高级筛选",
    props: {
      formData: {
        number: "",
        compareType: "",
        searchType: ""
      },
    },
    renderContent: () => ItemForm,
    beforeSure: async (done, options) => {
      const { data } = options.props;
      //赋值
      formData.value.number = data.number;
      formData.value.compareType = data.compareType;
      formData.value.searchType = data.searchType;
      done();
    },
  });
};

const formData = ref({
  start_time: Date.now(),
  end_time: Date.now(),
  exclude: [],
  items: '',
  searchType: "",
  compareType: "",
  number: "",
  gifts: [],
});



const getUserList = async () => {
  userList.value = await httpPost('/user.list.get', {
    queryString: queryStringForUser.value,
  });
};
const exportReport = async () => {
  const response = await httpPost('/report.manager.list.get', {
    ...formData.value,
    queryString: queryString.value,
    activeKey: activeKey.value,
    searchType: searchType.value,
    page: 1,
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

</script>

<style scoped>
/* Add your scoped styles here */
</style>
