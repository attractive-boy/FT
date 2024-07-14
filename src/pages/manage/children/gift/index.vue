<template>
  <view class="bg-gray-200 min-h-screen content">
    <!-- 添加按钮 -->
    <view class="w-1/2 m-2 mx-auto">
      <nut-button block type="success" @click="addItem">添加礼物</nut-button>
    </view>
    <!-- 礼物表格 -->
    <div class="bg-white m-2">
      <nut-table
        class="w-full"
        :columns="getColumns(getGift)"
        :data="itemData"
      ></nut-table>
    </div>
  </view>
</template>

<script lang="ts" setup>
import httpPost from "@/utils/http";
import { onMounted, ref } from "vue";
import { getColumns } from "./columns";
import { showActionSheet } from "@/components/MyActionSheet";
import ItemForm from "./ItemForm.vue";

const itemData = ref([]);
const getGift = async () => {
  const result = await httpPost("/gift.get");
  itemData.value = result;
};
const addItem = () => {
  showActionSheet({
    title: "添加礼物",
    props: {
      formData: {
        name: "",
        commission: null,
        rebate: null,
      },
    },
    renderContent: () => ItemForm,
    beforeSure: async (done, options) => {
      const { formData } = options.props;
      if (await httpPost("/gift.add", formData)) {
        await getGift();
        done();
      }
    },
  });
};
onMounted(async () => {
  await getGift();
});
</script>
