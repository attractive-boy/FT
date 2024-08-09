<template>
  <view class="bg-gray-200 min-h-screen content">
    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <nut-grid :column-num="4" :clickable="true" :border="false">
        <nut-grid-item text="可提现" >
          {{statics.balance}}
        </nut-grid-item>
        <nut-grid-item text="退款中" >
          {{statics.refund}}
        </nut-grid-item>
        <nut-grid-item text="处理中" >
          {{statics.processing}}
        </nut-grid-item>
        <nut-grid-item text="已提现" >
          {{statics.withdraw}}
        </nut-grid-item>
      </nut-grid>
    </view>
    <view class="w-1/2 m-2 mx-auto">
      <nut-button block type="success" @click="getSallary">领工资</nut-button>
    </view>
    <div class="bg-white m-2">
      <nut-table
        class="w-full"
        :columns="getColumns(getSallaryHistory)"
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
const statics:any = ref(null);

onMounted(async () => {
  await getSallaryHistory()
  await getStatic()
});

const getSallaryHistory = async () => {
  const result = await httpPost("/user.pay.get.list");
  itemData.value = result;
};

const getStatic = async () => {
  const result = await httpPost("/user.pay.get.balance");
  console.log(result);
  statics.value = result;
};
const getSallary = async () => {
  showActionSheet({
    props: {
      formData: {
      },
    },
    renderContent: () => ItemForm,
    beforeSure: async (done, options) => {
      const { formData } = options.props;
      if (await httpPost("/user.pay.get", formData)) {
        await getSallaryHistory()
        done();
      }
    },
  });
};
</script>
