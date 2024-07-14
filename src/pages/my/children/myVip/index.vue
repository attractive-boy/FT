<template>
  <view class="bg-gray-200 min-h-screen content">
    <!-- 添加按钮 -->
    <view class="w-1/2 m-2 mx-auto">
      <nut-button block type="success" @click="addVip">添加会员</nut-button>
    </view>
    <!-- 项目表格 -->
    <div class="bg-white m-2">
      <nut-table
        class="w-full"
        :columns="getColumns(getVip)"
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
const getVip = async () => {
  const result = await httpPost("/vip.get");
  itemData.value = result;
};
const addVip = () => {
  showActionSheet({
    title: "添加会员",
    props: {
      formData: {
        name: "",
      },
    },
    renderContent: () => ItemForm,
    beforeSure: async (done, options) => {
      const { formData } = options.props;
      if (await httpPost("/vip.add", formData)) {
        await getVip();
        done();
      }
    },
  });
};
onMounted(async () => {
  await getVip();
});
</script>
