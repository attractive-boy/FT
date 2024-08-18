<template>
  <view class="bg-gray-200 min-h-screen content">
    <view class="w-auto rounded-md m-2 px-2 bg-white">
      <nut-grid :column-num="4" :clickable="true" :border="false">
        <nut-grid-item text="可提现">
          <view class="amount">{{ statics.balance.toFixed(2) }}</view>
        </nut-grid-item>
        <nut-grid-item text="退款中">
          <view class="amount">{{ statics.refund.toFixed(2) }}</view>
        </nut-grid-item>
        <nut-grid-item text="处理中">
          <view class="amount">{{ statics.processing.toFixed(2) }}</view>
        </nut-grid-item>
        <nut-grid-item text="已提现">
          <view class="amount">{{ statics.withdraw.toFixed(2) }}</view>
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
      <nut-pagination
      v-model="currentPage" :total-items="totalRecords" :items-per-page="pageSize" @change="handlePageChange"

      ></nut-pagination>
    </div>
  </view>
</template>

<script lang="ts" setup>
import httpPost from "@/utils/http";
import { onMounted, ref } from "vue";
import { getColumns } from "./columns";
import { showActionSheet } from "@/components/MyActionSheet";
import ItemForm from "./ItemForm.vue";
import Taro from '@tarojs/taro';

const itemData = ref([]);
const statics:any = ref(null);
const currentPage = ref(1);
const pageSize = ref(10); // 每页显示的条数
const totalRecords = ref(0); // 总记录数

onMounted(async () => {
  await getSallaryHistory()
  await getStatic()
});
const handlePageChange = async (page: number) => {
  await getSallaryHistory(page);
};
const getSallaryHistory = async (page = 1) => {
  const result = await httpPost("/user.pay.get.list", { page, pageSize: pageSize.value });
  itemData.value = result.data; // 假设返回的数据结构为 { data: [], total: 100 }
  totalRecords.value = result.total; // 总记录数
  currentPage.value = page;
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
       // 检查 formData 是否完整
       const isValid = formData.phone.length > 0 && formData.name.length > 0 && formData.amount > 0 &&
                      formData.fee >= 0 && formData.actual_amount >= 0 &&
                      formData.qrcode_url.length >= 2; 
        console.log(formData);
      if (!isValid) {
        Taro.showToast({ title: '请确保所有字段填写完整且二维码图片至少两张', icon: 'none' });
        return;
      }
      //如果提现金额大于可提现金额
      if (formData.amount > statics.value.balance) {
        Taro.showToast({ title: '提现金额大于可提现金额', icon: 'none' });
        return;
      }
      
      if (await httpPost("/user.pay.get", formData)) {
        
      }
      //重新加载该页面
      Taro.reLaunch({ url: "/pages/my/children/mySalary/index" });
        done();
    },
  });
};
</script>
<style lang="scss">
.nut-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  word-wrap: break-word; /* 允许长文本换行 */
  overflow-wrap: break-word; /* 兼容性处理长文本换行 */
  text-align: center;
}
.nut-grid-item .amount {
  max-width: 18vw !important; /* 设置最大宽度以控制换行 */
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
