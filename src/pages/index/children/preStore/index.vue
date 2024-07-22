<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="bg-white">
      <SegmentedControl
        v-model="queryMode.type"
        :tabs="['我的预存', '所有预存']"
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
        class="mb-2"
      />
    </div>
    <nut-button type="primary" block @click="submit">预存报备</nut-button>
  </div>
</template>
<script setup lang="ts">
import SegmentedControl from "@/components/SegmentedControl/index.vue";
import ReportCard from "./ReportCard.vue";
import { onMounted, ref, watch } from "vue";
import httpPost from "@/utils/http";

const reportList = ref();
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
