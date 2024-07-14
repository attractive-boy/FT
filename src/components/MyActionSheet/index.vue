<template>
  <nut-action-sheet
    :visible="true"
    :title="options.title"
    @close="emits('close')"
  >
    <div class="px-2">
      <component :is="options.renderContent()" v-bind="options?.props" />
    </div>
    <div class="flex justify-around items-center pb-5">
      <div class="w-1/2 p-2">
        <nut-button
          type="default"
          shape="square"
          block
          @click="
            () => {
              if (options?.beforeClose) {
                options.beforeClose(done, options);
              } else {
                done();
              }
              options?.closeCallBack && options.closeCallBack();
            }
          "
          >取消</nut-button
        >
      </div>

      <div class="w-1/2 p-2">
        <nut-button
          type="success"
          shape="square"
          block
          @click="
            () => {
              if (options?.beforeSure) {
                options.beforeSure(done, options);
              } else {
                done();
              }
              options?.closeCallBack && options.closeCallBack();
            }
          "
          >确定</nut-button
        >
      </div>
    </div>
  </nut-action-sheet>
</template>

<script setup lang="ts">
import { type ActionSheetOptions } from "./type";

defineProps<{ options: ActionSheetOptions }>();
const emits = defineEmits(["close"]);

const done = () => emits("close");
</script>

<style scoped></style>
