<template>
  <div class="flex flex-col justify-between min-h-screen">
    <div class="p-5">
      <nut-form>
        <nut-form-item label="昵称" :label-width="50">
          <nut-input v-model="formData.nick_name" readonly />
        </nut-form-item>
        <nut-form-item label="积分" :label-width="50">
          <nut-input v-model="formData.points" readonly />
        </nut-form-item>
        <nut-cell title="类型" :desc="formData.type" @click="show = true"></nut-cell>
        <nut-popup v-model:visible="show" position="bottom">
          <nut-picker 
            v-model="formData.type" 
            :columns="typeList" 
            :field-names="{ text: 'name', value: 'id' }"
            title="请选择充值类型" 
            @confirm="confirm" 
            @cancel="show = false" 
          />
        </nut-popup>
        <nut-form-item label="好友" v-if="formData.type === '好友充值'">
          <MyPickerCell
            v-model="formData.owner"
            :field-names="{ text: 'nick_name', value: 'id' }"
            :columns="userList"
          >
            <template #top>
              <nut-searchbar
                placeholder="此处可以搜索成员昵称"
                v-model="queryStringForUser"
                @search="getUserList"
              ></nut-searchbar>
            </template>
          </MyPickerCell>
        </nut-form-item>
        <nut-form-item label="充值" :label-width="50">
          <nut-input v-model="formData.recharge" type="number" placeholder="请填写需要充值的积分" />
        </nut-form-item>
      </nut-form>
      <nut-button type="primary" block @click="submit">确定</nut-button>

      <div class="bg-white m-2 overflow-x-auto">
        <nut-table
          class="w-full"
          :columns="getColumns(getItem)"
          :data="pagedItemData"
        ></nut-table>
        <nut-pagination
        v-model="page" :total-items="totalCount" :items-per-page="pageSize" @change="handlePageChange"
 
        ></nut-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import httpPost from '@/utils/http';
import { ref, onMounted, computed } from 'vue';
import { getColumns } from './columns';
import { toFixed } from '@/utils/toFixed';
import Taro from '@tarojs/taro';
import { message } from '@/utils/message';

// 表单数据
const formData = ref({
  nick_name: '',
  points: '',
  type: '自己充值',
  owner: null,
  recharge: ''
});

// 用户列表和类型列表
const userList = ref([]);
const typeList = ref([
  { id: '自己充值', name: '自己充值' },
  { id: '好友充值', name: '好友充值' }
]);
const show = ref(false);
const queryStringForUser = ref('');
const page = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的记录数
const totalCount = ref(0);

const pagedItemData = computed(() => {
  return itemData.value;
});

const confirm = ({ selectedValue, selectedOptions }) => {
  show.value = false;
};

const submit = async () => {
  const options = await httpPost("/pay", {
    desc: `积分充值`,
    total: toFixed(Number(formData.value.recharge), 2),
  });

  Taro.requestPayment({
    ...options.data,
    success: async () => {
      if (formData.value.type === '好友充值') {
        if (formData.value.owner != null) {
          await httpPost('/recharge.friend', { amount: formData.value.recharge, recipient_id: formData.value.owner });
        }
      } else {
        await httpPost('/recharge', { amount: formData.value.recharge });
      }
      await init();
    },
    fail() {
      message("支付失败", { icon: "error" });
    },
  });
};

const getUserList = async () => {
  try {
    userList.value = await httpPost('/user.list.get', { queryString: queryStringForUser.value });
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};

const itemData = ref([]);
const init = async () => {
  try {
    const response = await httpPost('/user.info.get');
    formData.value.nick_name = response.nick_name || '';
    formData.value.points = response.points || '';

    await getList();
    await getUserList();
  } catch (error) {
    console.error('初始化数据失败', error);
  }
};

const getList = async () => {
  try {
    const response = await httpPost('/recharge.list.get', {
      page: page.value,
      pageSize: pageSize.value
    });
    itemData.value = response.data;
    totalCount.value = response.totalCount;
    console.log(response);
  } catch (error) {
    console.error('获取充值记录失败', error);
  }
};

onMounted(async () => {
  await init();
});

const handlePageChange = (newPage) => {
  page.value = newPage;
  getList();
};

const getItem = () => {
  return itemData.value.map(item => ({
    ...item,
  }));
};
</script>

<style scoped></style>
