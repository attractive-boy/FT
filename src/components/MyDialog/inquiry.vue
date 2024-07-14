<template>
  <nut-dialog
    ref="dialog"
    :visible="true"
    :title="options.title"
    :content="options?.content"
    @cancel="done(false)"
    @closed="done(false)"
    @ok="done(true)"
  />
</template>

<script setup lang="ts">
defineProps<{ options }>();
const emits = defineEmits(["close"]);

const done = (bl) => emits("close", bl);
</script>

<style scoped></style>
