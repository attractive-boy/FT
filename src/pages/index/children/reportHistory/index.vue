<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="bg-white">
      <SegmentedControl
        v-model="queryMode.type"
        :tabs="['我的待办', '我的接单', '我的点单']"
      />
      <div class="p-2">
        <SegmentedControl
          v-model="queryMode.range"
          :tabs="['全部', '本月', '本周', '今天', '范围']"
          reality
        />
      </div>
    </div>
    <div class="p-2">
      <ReportCard
        v-for="(item, index) in reportList"
        :key="index"
        :item="item"
        :showOperation="showOperation"
        class="mb-2"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import SegmentedControl from "@/components/SegmentedControl/index.vue";
import ReportCard from "./ReportCard.vue";
import { computed, onMounted, ref, watch } from "vue";
import httpPost from "@/utils/http";
import { report } from "process";

const reportList = ref();
const showOperation = computed(() => {
  return queryMode.value.type === 0;
});
const queryMode = ref({
  range: 0,
  type: 0,
});
const getReportList = async () => {
  reportList.value = await httpPost("/report.get.list", {
    queryMode: queryMode.value,
  });
};

watch(queryMode.value, async () => {
  await getReportList();
});

onMounted(async () => {
  await getReportList();
});
</script>
