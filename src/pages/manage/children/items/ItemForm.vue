<template>
  <nut-form>
    <nut-form-item label="项目">
      <nut-input
        v-model="formData.name"
        placeholder="请输入项目名称"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label="抽成">
      <nut-input
        v-model="formData.commission"
        placeholder="请输入抽成 / %"
        type="number"
      />
    </nut-form-item>
    <nut-form-item label="会员抽成">
      <nut-input
        v-model="formData.hycommission"
        placeholder="请输入会员抽成 / %"
        type="number"
      />
    </nut-form-item>
    <nut-form-item label="返点">
      <nut-input
        v-model="formData.rebate"
        placeholder="请输入返点 / %"
        type="number"
      />
    </nut-form-item>
    <nut-form-item label="会员返点">
      <nut-input
        v-model="formData.hyrebate"
        placeholder="请输入会员返点 / %"
        type="number"
      />
    </nut-form-item>
  </nut-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formData: {
    name: string;
    commission: number | null;
    rebate: number | null;
    hycommission: number | null;
    hyrebate: number | null;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => ({ name: "", commission: null, rebate: null, hycommission: null, hyrebate: null }),
});

const formData = ref(props.formData);
</script>
