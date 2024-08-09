<template>
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
  </view>
</template>

<script lang="ts" setup>
import httpPost from "@/utils/http";
import { onMounted, ref, watch } from "vue";
import { h } from "vue";
import { navigateTo } from "@tarojs/taro";

const itemData = ref([]);
const searchType = ref('会员老板');
const searchPlaceholder = ref('搜索会员老板');
const filteredItemData = ref([]);
const queryString = ref('');

const getVip = async () => {
  const result = await httpPost("/vip.get");
  itemData.value = result;
  filteredItemData.value = result;
};

const getColumns = () =>
  [
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
          "span",
          {
            style: { cursor: "pointer", color: "#409EFF" },
            onClick: () => {
              const url = `/pages/my/children/myVip/children/index?id=${row.id}`;
              navigateTo({ url });
            }
          },
          '查看'
        )
    },
  ];

onMounted(async () => {
  await getVip();
});


const searchName = () => {
  console.log(queryString.value);
  filteredItemData.value = itemData.value.filter((item) => {
    return item.name.toLowerCase().includes(queryString.value.toLowerCase());
  });
};
</script>
