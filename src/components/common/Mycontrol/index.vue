<template>
  <nut-action-sheet
    v-model:visible="options.visible"
    :title="options?.title || '请选择你想要进行的操作！'"
    :menu-items="options?.menuItems"
    :cancel-txt="options?.cancelTxt || '取消'"
    @choose="handleChoose"
    @close="done"
    @cancel="done"
  />
</template>
<script setup lang="ts">
import { ControlOptions } from "./type";

const props = defineProps<{ options: ControlOptions }>();
const emits = defineEmits(["close"]);

const done = () => emits("close");

const handleChoose = (item, index) => {
  props.options.selectCallBack({ item, index, done });
};
</script>
