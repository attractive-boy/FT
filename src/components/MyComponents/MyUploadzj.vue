<template>
  <nut-cell-group>
    <nut-cell title="战绩">
      <template #link>
        <nut-uploader
          v-model:file-list="fileList"
          :url="baseUrl + '/item.img.upload'"
          :is-preview="false"
          :source-type="['album']"
          :size-type="['compressed']"
          multiple
          @success="onSuccess"
        >
          <nut-button type="warning" size="small">选择图片</nut-button>
        </nut-uploader>
      </template>
    </nut-cell>
    <div class="flex w-full p-3 flex-wrap">
      <div class="w-1/3 p-1" v-for="(item, index) in fileList" :key="index">
        <div class="relative">
          <image
            :src="item.path"
            class="rounded w-full h-auto aspect-square bg-gray-100 shadow-lg"
            mode="aspectFill"
          />
          <div
            v-if="item.status !== 'success'"
            class="rounded text-xs absolute bg-black bg-opacity-30 top-0 left-0 w-full aspect-square flex items-center justify-center text-gray-300"
          >
            {{ item.message }}
          </div>
          <div
            class="w-6 h-6 absolute top-1 right-1 text-white bg-black opacity-50 rounded-full"
            @click="delItemImg(index)"
          >
            <Failure size="24" />
          </div>
        </div>
      </div>
    </div>
  </nut-cell-group>
</template>
<script setup lang="ts">
import { FileItem } from "@nutui/nutui-taro/dist/types/__VUE/uploader/type";
import { ref } from "vue";
import { Failure } from "@nutui/icons-vue-taro";

const baseUrl = process.env.TARO_APP_BASE_URL;

const fileList = ref([] as FileItem[]);

const delItemImg = (index: number) => {
  fileList.value.splice(index, 1);
};
const onSuccess = ({ data, fileItem }) => {
  fileItem.url = data.data;
};

defineExpose({
  fileList,
});
</script>
<style>
.nut-uploader__preview {
  margin: 0;
}
</style>
