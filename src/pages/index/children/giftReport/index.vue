<template>
  <div class="flex flex-col justify-between min-h-screen">
    <div class="p-5">
      <!-- 表单 -->
      <nut-form>
        <MyDatePickerCell
          title="收礼时间"
          v-model="formData.startTime"
          type="datetime"
          :is-show-chinese="true"
        />
        <MySwitchCell title="会员单" v-model="isVip" />
        <nut-form-item v-if="!isVip" label="老板名字">
          <nut-input
            v-model="formData.boss"
            placeholder="请输入老板微信昵称或游戏ID"
            type="text"
          />
        </nut-form-item>
        <MyPickerCell
          title="礼物选择"
          v-model="formData.item"
          :field-names="{ text: 'name', value: 'id' }"
          :columns="itemList"
        />
        <MyNumPickerCell
          style="--nut-cell-color: #e6a23c"
          title="礼物单价"
          v-model.number="formData.unitPrice"
          :min="0"
        />
        <MyNumPickerCell
          style="--nut-cell-color: #e6a23c"
          title="礼物数量"
          v-model.number="formData.orderCount"
          :min="0"
        />
        <MyPickerCell
          title="归属人"
          v-model="formData.owner"
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
        <MyPickerCell
          v-if="isVip && formData.owner"
          title="会员选择"
          default="请选择预存老板"
          v-model="formData.vip_id"
          :field-names="{ text: 'vip_name', value: 'vip_id' }"
          :columns="
            userList.find((item) => item.user_id === formData.owner)?.vips || []
          "
        />
      </nut-form>
      <div class="shadow-lg p-5 flex justify-around w-full rounded-lg">
        <div class="flex flex-col items-center w-1/4">
          <span class="text-sm text-gray-500">总金额</span>
          <b class="text-red-500">{{ toFixed(total, 2) }}</b>
        </div>
        <div class="flex flex-col items-center w-1/4">
          <span class="text-sm text-gray-500">抽成</span>
          <b class="text-orange-500">{{ toFixed(commission, 2) }}</b>
        </div>
        <div class="flex flex-col items-center w-1/4">
          <span class="text-sm text-gray-500">返点</span>
          <b class="text-blue-500">{{ toFixed(rebate, 2) }}</b>
        </div>
        <div class="flex flex-col items-center w-1/4">
          <span class="text-sm text-gray-500">收入</span>
          <b class="text-green-500">{{ toFixed(income, 2) }}</b>
        </div>
      </div>
      <div class="shadow-lg p-1 flex justify-around w-full rounded-lg">
        <span class="text-sm text-gray-500" style="padding: 1rem 0;">本次报备需要消耗 <b class="text-blue-500">{{ toFixed(total, 2) }}</b> 积分</span>
      </div>
      <div class="shadow-lg p-1 flex justify-around w-full rounded-lg">
        <span class="text-sm text-gray-500" style="padding: 1rem 0;">您当前剩余 <b class="text-blue-500">{{ toFixed(myPoints, 2) }}</b> 积分</span>
      </div>
    </div>
    <div class="p-5">
      <nut-button @click="reportPay" type="success" block
        >支付 && 报备</nut-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import MyPickerCell from "@/components/MyComponents/MyPickerCell.vue";
import MyDatePickerCell from "@/components/MyComponents/MyDatePickerCell.vue";
import MyNumPickerCell from "@/components/MyComponents/MyNumPickerCell.vue";
import httpPost from "@/utils/http";
import { computed, onMounted, ref } from "vue";
import { toFixed } from "@/utils/toFixed";
import Taro from "@tarojs/taro";
import { message } from "@/utils/message";
import MySwitchCell from "@/components/MySwitch/index.vue";
const formData = ref({
  item: 1,
  startTime: Date.now(),
  unitPrice: 0,
  orderCount: 0,
  owner: null,
  boss: "",
  lose: 0,
  urls: [],
  vip_id: null,
});
const myPoints = ref(0);
const isVip = ref(false);
const itemList = ref(); // 项目列表数据，从接口获取或从父组件传递
const userList = ref();
const queryStringForUser = ref(""); // 用户查询字符串，从父组件传递或从输入框获取
const selectItem = computed(() =>
  itemList.value?.find((item) => item.id === formData.value.item)
);
const total = computed(
  () => formData.value.unitPrice * formData.value.orderCount
);
const commission = computed(
  () => total.value * (selectItem?.value?.commission || 0) * 0.01
);
const rebate = computed(
  () => total.value * (selectItem?.value?.rebate || 0) * 0.01
);
const income = computed(() => total.value - commission.value);

const reportPay = async () => {
  if (myPoints.value < toFixed(total.value, 2)) {
    message("您的积分不足，请先充值", { icon: "error" });
    return;
  }
  if (
    await httpPost("/report", {
          formData: { ...formData.value, type: "item",
          // 总金额
          total: toFixed(total.value, 2),
          // 抽成
          commission: toFixed(commission.value, 2),
          // 返点
          rebate: toFixed(rebate.value, 2),
          // 收益
          income: toFixed(income.value, 2),
          // 积分
          amount: toFixed(commission.value, 2),
          
           },
    })
  ) {
    
  }

  Taro.switchTab({ url: "/pages/index/index" });
};
const getUserList = async () => {
  userList.value = await httpPost("/user.list.get", {
    queryString: queryStringForUser.value,
  });
};

onMounted(async () => {
  itemList.value = await httpPost("/gift.list.get");
  formData.value.item = itemList.value.find((item) => item.default === 1)?.id || 0; // 默认选中第一个项目
  await getUserList();

  const id = Taro.getCurrentInstance().router?.params?.id;
  if (id) {
    try {
      const res = await httpPost("/report.detail.get", { id });
      const data = res;
      formData.value = {
        item: data.item_id,
        startTime: formData.value.startTime,
        unitPrice: data.unit_price,
        orderCount: data.order_count,
        owner: data.belonged_id,
        boss: data.boss,
        lose: data.lose,
        urls: data.urls,
        vip_id: data.vip_id,
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
    }
  }
  getMyPoints();
});

const getMyPoints = async () => {
  const res = await httpPost("/user.points.get");
  myPoints.value = res;
};
</script>

<style scoped></style>
