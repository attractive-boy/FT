<template>
  <div class="flex flex-col justify-between min-h-screen">
    <div class="p-5">
      <!-- 表单 -->
      <nut-form>
        <nut-form-item label="昵称" :label-width="50">
          <nut-input v-model="formData.nick_name" readonly />
        </nut-form-item>
        <!-- 积分 -->
        <nut-form-item label="积分" :label-width="50">
          <nut-input v-model="formData.points" readonly />
        </nut-form-item>
        <!-- 类型 为自己充值 为好友充值 选择框 -->
        <!-- <nut-form-item label="类型"> -->
          <nut-cell title="类型" :desc="String(formData.type)" @click="show = true"></nut-cell>
          <nut-popup v-model:visible="show" position="bottom">
            <nut-picker v-model="formData.type" :columns="typeList" :field-names="{ text: 'name', value: 'id' }"
             title="请选择充值类型" @confirm="confirm" @cancel="show = false" />
          </nut-popup>
        <!-- </nut-form-item> -->
        <!-- 好友，仅在选择为好友充值时显示 -->
        <nut-form-item label="好友" v-if="formData.type == '好友充值'">
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
        <!-- 充值 -->
        <nut-form-item label="充值" :label-width="50">
          <nut-input v-model="formData.recharge" type="number" placeholder="请填写需要充值的积分"/>
        </nut-form-item>
      </nut-form>
      <nut-button type="primary" block @click="submit">确定</nut-button>

      <div class="bg-white m-2 overflow-x-auto">
      <nut-table
        class="w-full"
        style="width: 150%;"
        :columns="getColumns(getItem)"
        :data="itemData"
      ></nut-table>
    </div>
    </div>
    <!-- 底部记录 -->
    
  </div>
</template>

<script lang="ts" setup>
import httpPost from "@/utils/http";
import { ref, onMounted } from "vue";
import { getColumns } from "./columns";

// 表单数据
const formData = ref({
  nick_name: '',
  points: '',
  type: '',
  owner: null,
  recharge: ''
});

// 用户列表和类型列表
const userList = ref([]);
const typeList = ref([
  { id: '自己充值', name: '自己充值' },
  { id: '好友充值', name: '好友充值' }
]);
const show = ref(false)
// 搜索条件
const queryStringForUser = ref('');
const confirm = ({ selectedValue, selectedOptions }) => {
  show.value = false
}
// 提交表单数据
const submit = async () => {
  //判断给自己还是好友 /recharge.friend
  if (formData.value.type === '好友充值') {
    if (formData.value.owner != null) {
      await httpPost( '/recharge.friend', { amount : formData.value.recharge, recipient_id: formData.value.owner })
    } 
  }else{
    await httpPost( '/recharge', { amount : formData.value.recharge })
  }
};

// 获取用户列表
const getUserList = async () => {
  try {
    userList.value = await httpPost('/user.list.get', { queryString: queryStringForUser.value });
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};
const itemData = ref([]);
// 初始化数据
onMounted(async () => {
  try {
    // 获取用户信息或其他初始化操作
    const response = await httpPost('/user.info.get');
    console.log(response);
    formData.value.nick_name = response.nick_name;
    formData.value.points = response.points;

    //获取记录
    itemData.value = await httpPost('/recharge.list.get');
    await getUserList();
  } catch (error) {
    console.error('初始化数据失败', error);
  }
});

// 获取每行数据
const getItem = () => {
  // 返回一行示例数据
  return itemData.value.map(item => ({
    ...item,
    // 如果有其他处理逻辑，请在这里处理
  }));
};
</script>
