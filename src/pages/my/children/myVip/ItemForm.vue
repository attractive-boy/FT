<template>
  <nut-form>
    <nut-form-item label="会员名称">
      <nut-input
        v-model="formData.name"
        placeholder="请输入会员名称"
        type="text"
      />
    </nut-form-item>
  </nut-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formData: {
    name: string;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => ({ name: "" }),
});

const formData = ref(props.formData);
</script>
