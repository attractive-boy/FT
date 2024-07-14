<template>
  <div>
    <nut-cell
      :title="title"
      @click="(show = true), (value = modelValue)"
      :desc="desc"
    ></nut-cell>
    <nut-popup v-model:visible="show" position="bottom">
      <nut-picker
        :modelValue="[value]"
        v-bind="$attrs"
        :columns="pickerColumns"
        :fieldNames="fieldNames"
        @change="handlePickerChange"
        @confirm="
          () => {
            if (typeof $attrs.onconfirm === 'function') {
              return $attrs.onconfirm(done, value);
            } else {
              emits('update:modelValue', value);
              done();
            }
          }
        "
        @cancel="
          () => {
            if (typeof $attrs.oncancel === 'function') {
              return $attrs.oncancel(done, value);
            } else {
              done();
            }
          }
        "
      >
        <template v-for="(value, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
      </nut-picker>
    </nut-popup>
  </div>
</template>

<script setup lang="ts">
import { PickerOption } from "@nutui/nutui-taro/dist/types/__VUE/picker/types";
import { computed, ref } from "vue";

// 接收组件的 props
const props = defineProps<{
  title: string;
  modelValue: string | number;
  columns: (PickerOption | PickerOption[])[] | undefined;
  fieldNames?: { value: string; text: string };
  default?: string;
}>();

const emits = defineEmits(["update:modelValue"]);

const fieldNames = props.fieldNames || { value: "value", text: "text" };

const show = ref(false);
const value = ref(props.modelValue || 0); // 初始值设为 0，避免出现 undefined 的情况

const desc = computed(() => {
  const defaultOption = {
    [fieldNames.value]: 0,
    [fieldNames.text]: props?.default || "请选择",
  };
  const allOptions = [defaultOption, ...(props.columns || [])];

  const selectedItem = allOptions.find(
    (item) => item[fieldNames.value] === props.modelValue
  );

  return selectedItem
    ? selectedItem[fieldNames.text]
    : props?.default || "请选择";
});
const pickerColumns = computed(() => {
  return [
    { [fieldNames.value]: 0, [fieldNames.text]: props?.default || "请选择" },
    ...(props.columns || []),
  ];
});

const handlePickerChange = (event) => {
  value.value = event.selectedOptions[0][fieldNames.value];
};
const done = () => (show.value = false);
</script>
