<template>
  <SegmentedControl v-model="selectedTab" :tabs="['全部', '本月', '本周', '今日', '范围']" />
  <MyDateRangePicker v-if="selectedTab === 4" v-model="rangedate" @change="fetchVipData" />
  <view class="min-h-screen bg-gray-200 flex flex-col">
    <view class="mx-2 bg-white rounded-md p-2" style="margin-top: .5rem;">
      <view>
        <!-- 搜索框 -->
        <view class="flex items-center mb-2">
          <view style="font-size: small;white-space: nowrap;">{{ searchType }}</view>
          <nut-searchbar
            class="ml-2"
            :placeholder="searchPlaceholder"
            v-model="queryString"
            @input="searchName"
            @search="searchName"
          ></nut-searchbar>
        </view>
      </view>
    </view>
    <div class="bg-white m-2">
      <nut-table
        class="w-full"
        :columns="getColumns()"
        :data="filteredItemData"
      ></nut-table>
    </div>
    <nut-pagination
      :current-page="currentPage"
      :total-items="totalItems"
      :page-size="pageSize"
      @change="fetchVipData"
    ></nut-pagination>
    <!-- 修改余额对话框 -->
    <nut-dialog v-model:visible="showDialog" title="修改余额" @ok="updateBalance">
      <nut-form>
        <nut-form-item label="操作类型" :label-width="80">
          <nut-radio-group v-model="operationType" direction="horizontal">
            <nut-radio label="增加">增加</nut-radio>
            <nut-radio label="减少">减少</nut-radio>
          </nut-radio-group>
        </nut-form-item>
        <nut-form-item label="金额" :label-width="80">
          <nut-input v-model="amount" placeholder="请输入金额" type="number" />
        </nut-form-item>
      </nut-form>
    </nut-dialog>
  </view>
</template>

<script lang="ts" setup>
import httpPost from "@/utils/http";
import { onMounted, ref, h, watch } from "vue";
import { navigateTo } from "@tarojs/taro";
import MyDateRangePicker from "@/components/TimeRangePicker/index.vue";

const itemData = ref([]);
const searchType = ref('会员老板');
const searchPlaceholder = ref('搜索会员老板');
const filteredItemData = ref([]);
const queryString = ref('');

const showDialog = ref(false);
const selectedMember = ref(null);
const operationType = ref('增加'); // 增加或减少
const amount = ref('');

const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);

const selectedTab = ref(0);
const rangedate = ref({ start: '', end: '' });

const getColumns = () => [
  {
    title: "会员名",
    stylecolumn: "width: 25%",
    align: "center",
    key: "name",
  },
  {
    title: "所在群聊",
    key: "group",
    stylecolumn: "width: 25%",
    align: "center",
  },
  {
    title: "剩余金额",
    stylecolumn: "width: 25%",
    align: "center",
    key: "amount",
  },
  {
    title: "操作",
    stylecolumn: "width: 25%",
    align: "center",
    render: (row) =>
      h(
        "div",
        { style: { display: 'flex', justifyContent: 'center' } },
        [
          h(
            "span",
            {
              style: { cursor: "pointer", color: "#409EFF", marginRight: "10px" },
              onClick: () => {
                const url = `/pages/my/children/myVip/children/index?id=${row.id}`;
                navigateTo({ url });
              }
            },
            '查看'
          ),
          h(
            "span",
            {
              style: { cursor: "pointer", color: "#67C23A" },
              onClick: () => {
                selectedMember.value = row;
                showDialog.value = true;
              }
            },
            '修改余额'
          )
        ]
      )
  }
];

const fetchVipData = async () => {
  let startDate = '';
  let endDate = '';

  if (selectedTab.value === 1) {
    startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    endDate = new Date().toISOString();
  } else if (selectedTab.value === 2) {
    const current = new Date();
    const first = current.getDate() - current.getDay();
    startDate = new Date(current.setDate(first)).toISOString();
    endDate = new Date().toISOString();
  } else if (selectedTab.value === 3) {
    startDate = new Date().toISOString().split('T')[0];
    endDate = new Date().toISOString();
  } else if (selectedTab.value === 4) {
    startDate = rangedate.value.start;
    endDate = rangedate.value.end;
  }

  const result = await httpPost("/vip.get", {
    page: currentPage.value,
    pageSize: pageSize.value,
    startDate,
    endDate,
    queryString: queryString.value // Add the queryString here
  });

  itemData.value = result.data;
  totalItems.value = result.total;
  filteredItemData.value = result.data;
};

onMounted(fetchVipData);

watch([currentPage, selectedTab, rangedate], fetchVipData);

const searchName = () => {
  fetchVipData(); // Trigger a new backend search with the updated query string
};

const updateBalance = async () => {
  const newAmount = parseFloat(amount.value);
  if (isNaN(newAmount) || newAmount <= 0) {
    Taro.showToast({ title: '请输入有效的金额', icon: 'none' });
    return;
  }

  const adjustment = operationType.value === '增加' ? newAmount : -newAmount;
  const result = await httpPost("/vip.update", {
    id: selectedMember.value.id,
    amount: adjustment
  });

  if (result.success) {
    // Taro.showToast({ title: '余额更新成功', icon: 'success' });
    await fetchVipData(); // Refresh data
    showDialog.value = false;
    amount.value = ''; // Clear the input field
  } else {
    // Taro.showToast({ title: '余额更新失败', icon: 'none' });
  }
};
</script>
