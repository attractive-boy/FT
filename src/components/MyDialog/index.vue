<template>
  <div :style="{ '--nut-dialog-width': opts.width + 'px' }">
    <nut-dialog
      ref="dialog"
      :visible="opts?.visible"
      :title="opts?.title"
      :content="opts?.content"
      :ok-auto-close="props.options.beforeSure ? false : true"
      :cancel-auto-close="props.options.beforeCancel ? false : true"
      :cancel-text="opts?.cancelText"
      :ok-text="opts?.okText"
      :close-on-click-overlay="opts?.closeOnClickOverlay"
      :close-on-popstate="opts?.closeOnPopstate"
      @cancel="
        async () => {
          const done = () => emits('close');
          if (props.options.beforeCancel) {
            await props.options.beforeCancel(done);
          } else {
            done();
          }
        }
      "
      @closed="
        emits('close'),
          props.options?.closeCallback && props.options.closeCallback()
      "
      @ok="
        async () => {
          const done = () => emits('close');
          if (props.options.beforeSure) {
            await props.options.beforeSure(done);
          } else {
            done();
          }
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { type DialogOptions } from "./type";
import Taro from "@tarojs/taro";

function getScreenWidth(): Promise<number> {
  return new Promise((resolve, reject) => {
    Taro.getSystemInfo({
      success: (res) => {
        resolve(res.windowWidth);
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}

const dialog = ref();

const props = defineProps<{ options: DialogOptions }>();
const emits = defineEmits(["close"]);

const opts = ref(props.options);

onMounted(() => {
  getScreenWidth().then((width) => {
    opts.value.width = props.options?.width
      ? width - props.options?.width
      : width * 0.9;
  });
});
</script>

<style scoped></style>
