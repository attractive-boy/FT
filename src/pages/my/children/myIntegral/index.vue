<template>
  <div class="flex flex-col justify-between min-h-screen">
    <div class="p-5">
      <!-- 表单 -->
      <nut-form>
        <nut-form-item label="昵称" :label-width="50">
          <nut-input v-model="formData.nick_name" readonly />
        </nut-form-item>
        <!-- 积分 -->
        <nut-form-item label="积分" :label-width="50">
          <nut-input v-model="formData.integral" readonly />
        </nut-form-item>
        <!-- 类型 为自己充值 为好友充值 选择框 -->
        <nut-form-item label="类型">
          <nut-picker v-model="formData.type" :columns="typeList" :field-names="{ text: 'name', value: 'id' }" />
        </nut-form-item>
        <!-- 充值 -->
        <nut-form-item label="充值" :label-width="50">
          <nut-input v-model="formData.recharge" type="number" placeholder="请填写需要充值的积分"/>
        </nut-form-item>
      </nut-form>
      <nut-button type="primary" block @click="submit">确定</nut-button>
    </div>
    <!-- 底部记录 -->
    <div class="bg-white m-2">
      <nut-table
        class="w-full"
        :columns="getColumns(getItem)"
        :data="itemData"
      ></nut-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import httpPost from "@/utils/http";
import { onMounted, ref } from "vue";
import { getColumns } from "./columns";


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
