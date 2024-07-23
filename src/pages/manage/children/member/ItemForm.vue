<template>
  <nut-form>
    <nut-form-item label="昵称">
      <nut-input
        v-model="formData.nick_name"
        placeholder="请输入昵称"
        type="text"
      />
    </nut-form-item>
  </nut-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formData: {
    nick_name: string
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => ({ nick_name: ""}),
});

const formData = ref(props.formData);
</script>
