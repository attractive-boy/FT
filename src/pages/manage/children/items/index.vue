<template>
  <view class="bg-gray-200 min-h-screen content">
    <!-- 添加按钮 -->
    <view class="w-1/2 m-2 mx-auto">
      <nut-button block type="success" @click="addItem">添加项目</nut-button>
    </view>
    <!-- 项目表格 -->
    <div class="bg-white m-2 overflow-x-auto">
      <nut-table
        class="w-full"
        style="width: 150%;"
        :columns="getColumns(getItem)"
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
const getItem = async () => {
  const result = await httpPost("/item.get");
  itemData.value = result;
};
const addItem = () => {
  showActionSheet({
    title: "添加项目",
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
      if (await httpPost("/item.add", formData)) {
        await getItem();
        done();
      }
    },
  });
};
onMounted(async () => {
  await getItem();
});
</script>
