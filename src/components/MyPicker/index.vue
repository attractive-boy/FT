<template>
  <nut-popup v-model:visible="options.visible" position="bottom">
    <nut-picker
      v-model="pickerItem"
      :columns="options.columns"
      :title="options.title"
      :field-names="options.fieldNames"
      :cancel-text="options.cancelText"
      :ok-text="options.okText"
      :swipe-duration="options.swipeDuration"
      :visible-option-num="options.visibleOptionNum"
      :option-height="options.optionHeight"
      :show-toolbar="options.showToolbar"
      @confirm="confirm"
      @cancel="cancel"
      @change="change"
    />
  </nut-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type PickerOptions } from "./type";

const props = defineProps<{ options: PickerOptions }>();
const emits = defineEmits(["close"]);

const pickerItem = ref([props.options.modelValue]);

const confirm = ({ selectedValue, selectedOptions }) => {
  const done = () => emits("close");
  if (props.options?.onConfirm) {
    props.options?.onConfirm({
      selectedValue,
      selectedOptions,
      done,
    });
  } else {
    done();
  }
};
const cancel = ({ selectedValue, selectedOptions }) => {
  const done = () => emits("close");
  if (props.options?.onCancel) {
    props.options?.onCancel({
      selectedValue,
      selectedOptions,
      done,
    });
  } else {
    done();
  }
};
const change = ({ columnIndex, selectedValue, selectedOptions }) => {
  const done = () => emits("close");
  if (props.options?.onChange) {
    props.options?.onChange({
      columnIndex,
      selectedValue,
      selectedOptions,
      done,
    });
  } else {
    done();
  }
};
</script>
