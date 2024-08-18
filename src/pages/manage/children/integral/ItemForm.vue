<template>
  <nut-form>
    <nut-form-item label="昵称">
      <nut-input
        v-model="formData.nick_name"
        placeholder="请输入昵称"
        type="text"
        readonly
      />
    </nut-form-item>
    <!-- 积分 -->
    <nut-form-item label="积分">
      <nut-input
        v-model="formData.points"
        placeholder="请输入积分"
        readonly
      />
    </nut-form-item>
    <!-- 类型 -->
    <MyPickerCell
      title="类型"
      v-model="formData.transaction_type"
      :field-names="{ text: 'name', value: 'id' }"
      :columns="transactionTypeList"
    />
    <!-- 积分值 -->
    <nut-form-item label="积分值">
      <nut-input
        v-model="formData.amount"
        placeholder="请填写要调整的积分值"
        type="number"
      />
    </nut-form-item>
  </nut-form>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults } from 'vue';

// Define the types for the form data
export interface FormProps {
  formData: {
    nick_name: string;
    points: number;
    transaction_type: string;
    amount: number;
  };
}

// Define the props with default values
const props = withDefaults(defineProps<FormProps>(), {
  formData: () => ({
    nick_name: '',
    points: 0,
    transaction_type: '',
    amount: 0,
  }),
});

// Define the reactive form data
const formData = ref(props.formData);

// Define the transaction type options
const transactionTypeList = ref([
  { id: '1', name: '增加' },
  { id: '2', name: '减少' },
]);
</script>

<style scoped>
/* Add any styles needed for your form here */
</style>
