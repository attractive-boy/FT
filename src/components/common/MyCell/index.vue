<template>
  <div
    class="flex justify-between items-center p-1 bg-gray-100 rounded shadow-sm"
  >
    <text class="text-sm font-bold">{{ k }}</text>
    <text class="text-sm text-gray-500">{{ v }}</text>
  </div>
</template>

<script setup lang="ts">
defineProps<{ k: any; v: any }>();
</script>
