<template>
  <div>
    <nut-cell
      :title="title"
      @click="(show = true), (value = new Date(props.modelValue))"
      :desc="format(modelValue, 'yyyy-MM-dd HH:mm')"
    ></nut-cell>
    <nut-popup v-model:visible="show" position="bottom">
      <nut-date-picker
        v-model="value"
        @update:model-value="value = $event"
        v-bind="$attrs"
        @cancel="
          () => {
            if (typeof $attrs.oncancel === 'function') {
              return $attrs.oncancel(done);
            } else {
              done();
            }
          }
        "
        @confirm="
          () => {
            if (typeof $attrs.onconfirm === 'function') {
              return $attrs.onconfirm(done, value);
            } else {
              emits('update:modelValue', getTime(value));
              done();
            }
          }
        "
      ></nut-date-picker>
    </nut-popup>
  </div>
</template>
<script setup lang="ts">
import { format, getTime } from "date-fns";
import { ref } from "vue";

const show = ref(false);
const props = defineProps<{
  title: string;
  modelValue: number;
}>();
const emits = defineEmits(["update:modelValue"]);

const value = ref();

const done = () => (show.value = false);
</script>
