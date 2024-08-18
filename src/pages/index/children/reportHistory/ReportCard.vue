<template>
  <div class="rounded-lg bg-white shadow-sm p-3">
    <div class="flex justify-between items-end">
      <text class="text-sky-700 font-bold text-lg">
        {{ item.type === "item" ? "项目单" : "礼物单" }}
      </text>
      <div>
        <text class="text-rose-900 font-bold text-lg">
          {{ item.item_name }}
        </text>
        <text v-if="item.vip_id" class="text-red-500 font-bold text-base">
          （会员单）
        </text>
      </div>
      <text class="text-orange-500 font-bold text-base">
        {{ item.status }}
      </text>
    </div>
    <div class="flex justify-around mt-2 bg-gray-100 p-2 rounded-md">
      <div class="flex justify-between items-center w-1/3">
        <nut-avatar shape="square">
          <img :src="item.user_avatar" />
        </nut-avatar>
        <div class="flex flex-col items-center justify-around">
          <text class="text-gray-500">
            {{ item.user_name }}
          </text>
          <nut-tag plain type="success"> 接单人 </nut-tag>
        </div>
      </div>
      <div class="flex justify-between items-center w-1/3">
        <nut-avatar shape="square">
          <img :src="item.owner_avatar" />
        </nut-avatar>
        <div class="flex flex-col items-center justify-around">
          <text class="text-gray-500">
            {{ item.owner_name }}
          </text>
          <nut-tag plain type="warning"> 所属人 </nut-tag>
        </div>
      </div>
    </div>
    <div class="flex mt-2 flex-wrap gap-1">
      <MyCell k="老板：" :v="item.vip_name || item.boss" style="flex: 1 1 calc(50% - 10px)" />
      <MyCell
        k="单价："
        :v="item.unit_price"
        style="flex: 1 1 calc(50% - 10px)"
      />
      <MyCell
        k="数量："
        :v="item.order_count"
        style="flex: 1 1 calc(50% - 10px)"
      />
      <MyCell k="总价：" :v="total" style="flex: 1 1 calc(50% - 10px)" />
      <MyCell v-if="item.type === 'item'"  k="胜场：" :v="win" style="flex: 1 1 calc(50% - 10px)" />
      <MyCell
        v-if="item.type === 'item'"
        k="胜率："
        :v="toFixed(win_rate,2) + '%'"
        style="flex: 1 1 calc(50% - 10px)"
      />
      <MyCell k="抽成：" :v="commission" style="flex: 1 1 calc(50% - 10px)" />
      <MyCell k="返点：" :v="rebate" style="flex: 1 1 calc(50% - 10px)" />
      <MyCell
        k="开始接单时间："
        :v="timeFormat(item.start_time)"
        class="w-full"
      />
      <MyCell k="报备时间：" :v="timeFormat(item.create_time)" class="w-full" />
      <MyCell k="订单号：" v="882d3208-1e05-4336-8d62" class="w-full" />
    </div>
    <div class="flex justify-around mt-2" v-if="props.showOperation">
      <nut-button
        style="--nut-button-border-radius: 8px"
        plain
        size="small"
        type="warning"
        @click="showImg = true"
        >截图 {{ img_url.length }} 张</nut-button
      >
      <nut-button
        style="--nut-button-border-radius: 8px"
        plain
        size="small"
        type="info"
        >复制</nut-button
      >
      <nut-button
        style="--nut-button-border-radius: 8px"
        plain
        size="small"
        type="danger"
        @click="reject"
        >拒绝</nut-button
      >
      <nut-button
        style="--nut-button-border-radius: 8px"
        plain
        size="small"
        type="success"
        @click="pass"
        >通过</nut-button
      >
    </div>
    <nut-image-preview
      v-if="img_url.length"
      :show="showImg"
      :images="img_url"
      @close="showImg = false"
    />
  </div>
</template>

<script setup lang="ts">
import MyCell from "@/components/common/MyCell/index.vue";
import { computed, ref } from "vue";
import { timeFormat } from "@/utils/format";
import httpPost from "@/utils/http";
const TARO_APP_OSS = process.env.TARO_APP_OSS;
import Taro from '@tarojs/taro';
import { toFixed } from "@/utils/toFixed";
import ItemForm from "@/pages/manage/children/gift/ItemForm.vue";

const props = defineProps<{
  item: any;
  showOperation: boolean;
}>();
const showImg = ref(false);

const total = computed(() => props.item?.unit_price * props.item?.order_count);
const commission = computed(
  () => total.value * (props.item?.commission || 0) * 0.01
);
const rebate = computed(() => total.value * (props.item?.rebate || 0) * 0.01);
const win = computed(() => props.item.win > 0 ?  props.item.win : props.item.order_count - props.item.lose || 0);
const win_rate = computed(() => (win.value / (props.item.win > 0 ? (props.item.win  + props.item.lose) : props.item.order_count)) * 100);
const img_url = computed(() =>
  JSON.parse(props.item.urls).map((item) => {
    return { src: TARO_APP_OSS + item };
  })
);
const pass = async () => {
  // 改单子是否低于50胜率，低于50的话，弹窗提示显示文本“该单子胜率低于50，疑似炸单，请联系俱乐部管理人员处理，确定通过该单子审批通过”然后下面就是两个按钮一个取消，一个确认通过
  if ( ItemForm.value.type === "item" && win_rate.value < 50) {
    Taro.showModal({
      title: "提示",
      content: "该单子胜率低于50，疑似炸单，请联系俱乐部管理人员处理，确定通过该单子审批通过",
      success: async (res) => {
        if (res.confirm) {
          const res1 = await httpPost("/report.pass", {
            id: props.item.id,
          })
          if(res1 == "余额不足"){
            Taro.showToast({
              title: "余额不足",
              icon: "error",
              duration: 2000
            })
          }
          Taro.reLaunch({
            url: "/pages/index/children/reportHistory/index",
          });
        }
      }
    })
  }else{
    await httpPost("/report.pass", {
      id: props.item.id,
    })
    Taro.reLaunch({
      url: "/pages/index/children/reportHistory/index",
    });
  }
  
  
}
const reject = async () => {
  await httpPost("/report.reject", {
    id: props.item.id,
  });
  Taro.reLaunch({
    url: "/pages/index/children/reportHistory/index",
  });
}
</script>
