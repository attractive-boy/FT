<template>
  <nut-form>

    <MyPickerCell
      title="筛选类型"
      v-model="formData.searchType"
      :field-names="{ text: 'label', value: 'value' }"
      :columns="searchList"
    >
    </MyPickerCell>

    <MyPickerCell
      title="比较符号"
      v-model="formData.compareType"
      :field-names="{ text: 'label', value: 'value' }"
      :columns="compareList"
    >
    </MyPickerCell>
    <nut-form-item label="数值">
      <nut-input
        v-model="formData.number"
        placeholder="请填写"
        type="number"
      />
    </nut-form-item>
  </nut-form>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface FormProps {
  formData: {
    searchType: string,
    number: string,
    compareType : string
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formData: () => ({  
    number: "",
    compareType: "",
    searchType: ""
  }),
});

const searchList = ref([
  {
    label: "未选择",
    value: "未选择",
  },
  {
    label: "接单量",
    value: "接单量",
  },
  {
    label: "接单额",
    value: "接单额",
  },
  {
    label: "抽成",
    value: "抽成",
  },
  {
    label: "点单量",
    value: "点单量",
  },
  {
    label: "点单额",
    value: "点单额",
  },
  {
    label: "返点",
    value: "返点",
  },
  {
    label: "接单额 - 抽成",
    value:  "接单额 - 抽成",
  },
  {
    label: "接单额 + 返点",
    value: "接单额 + 返点",
  },
  {
    label: "接单额 - 抽成 + 返点",
    value: "接单额 - 抽成 + 返点",
  },
  {
    label: "点单量 - 抽成",
    value: "点单量 - 抽成",
  },
  {
    label: "点单量 + 返点",
    value: "点单量 + 返点",
  },
  {
    label: "点单量 - 抽成 + 返点",
    value: "点单量 - 抽成 + 返点",
  },

]);

const compareList = ref([
  {
    label: "大于",
    value: "大于",
  },
  {
    label: "小于",
    value: "小于",
  },
  {
    label: "等于",
    value: "等于",
  },
])

const formData = ref(props.formData);
</script>
