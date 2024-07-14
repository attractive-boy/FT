<template>
  <nut-cell :title="title">
    <template #link>
      <nut-switch v-bind="$attrs" />
    </template>
  </nut-cell>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
