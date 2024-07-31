<template>
  <div>
    <nut-cell :title="title">
      <template #link>
        <nut-input-number v-bind="$attrs" decimal-places="2" />
      </template>
    </nut-cell>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
