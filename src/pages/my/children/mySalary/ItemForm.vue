<template>
  <nut-form>
    <nut-form-item label="收款二维码">
      <nut-uploader :url="baseUrl + '/user.pay.qrcode.upload'" v-model:file-list="qrcodeList" @success="handleUploadSuccess"></nut-uploader>
    </nut-form-item>
    <nut-form-item label="收款人电话">
      <nut-input v-model="formData.phone" placeholder="请输入收款人电话" type="text" />
    </nut-form-item>
    <nut-form-item label="收款人姓名">
      <nut-input v-model="formData.name" placeholder="请输入收款人姓名" type="text" />
    </nut-form-item>
    <nut-form-item label="提现金额">
      <nut-input v-model="formData.amount" placeholder="请输入提现金额" type="text" @input="calculateFees"/>
    </nut-form-item>
    <nut-form-item label="提现手续费">
      <nut-input v-model="formData.fee" type="text" readonly />
    </nut-form-item>
    <nut-form-item label="实际到账金额">
      <nut-input v-model="formData.actual_amount" type="text" readonly />
    </nut-form-item>
  </nut-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const baseUrl = process.env.TARO_APP_BASE_URL;

export interface FormProps {
  formData: {
    phone: string;
    name: string;
    amount: number;
    fee: number;
    actual_amount: number;
    qrcode_url: string[];
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => ({
    phone: '',
    name: '',
    amount: 0,
    fee: 0,
    actual_amount: 0,
    qrcode_url: [],
  }),
});

const formData = ref(props.formData);
const qrcodeList = ref([]);

const calculateFees = () => {
  const feeRate = 0.006; // 提现手续费率
  formData.value.fee = parseFloat((formData.value.amount * feeRate).toFixed(2));
  formData.value.actual_amount = parseFloat((formData.value.amount - formData.value.fee).toFixed(2));
};

// 监听提现金额变化
watch(() => formData.value.amount, calculateFees);
const handleUploadSuccess = (response: any) => {
  console.log('',formData.value);
  if (response && response.data) {
    if(formData.value.qrcode_url == undefined){
      formData.value.qrcode_url = [response.data.data];
    }else{
      formData.value.qrcode_url.push(response.data.data);
    }
    
  }
};
</script>
