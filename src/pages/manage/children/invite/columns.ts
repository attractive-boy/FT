import { TableColumns } from "@nutui/nutui-taro/dist/types/__VUE/table/types";
import { h } from "vue";
import Taro from "@tarojs/taro";
import httpPost from "@/utils/http";
import { showControl } from "@/components/common/Mycontrol/index";
import { showActionSheet } from "@/components/MyActionSheet";
import ItemForm from "./ItemForm.vue";
import { inquiry } from "@/components/MyDialog/inquiry";

// Define the columns
export const getColumns = (getItem: () => void) =>
  [
    {
      title: "头像",
      key: "avatar_url",
      stylecolumn: "width: 25%",
      align: "center",
      render: (row) =>
        h("image", { src: row.avatar_url, style: "width: 30px; height: 30px;" }, undefined),
    },
    {
      title: "昵称",
      key: "nick_name",
      stylecolumn: "width: 25%",
      align: "center",
    },
    {
      title: "拒绝",
      stylecolumn: "width: 25%",
      align: "center",
      render: (row) =>
        h(
          "div",
          { style: "display: flex; align-items: center; justify-content: center; height: 100%;" },
          h(
            "button",
            {
              style: "padding: 0 10px;",
              class: "nut-button nut-button--default",
              onClick: async () => {
                const confirm = await inquiry({ message: "确定要拒绝此成员吗？" });
                if (confirm) {
                  try {
                    await httpPost("/user.reject", { id: row.id });
                    Taro.showToast({ title: "已拒绝", icon: "success" });
                    getItem(); // Refresh the table data
                  } catch (error) {
                    Taro.showToast({ title: "拒绝失败", icon: "error" });
                  }
                }
              },
            },
            " 拒绝 "
          )
        ),
    },
    {
      title: "同意",
      stylecolumn: "width: 25%",
      align: "center",
      render: (row) =>
        h(
          "div",
          { style: "display: flex; align-items: center; justify-content: center; height: 100%;" },
          h(
            "button",
            {
              style: "padding: 0 10px;",
              class: "nut-button nut-button--primary",
              onClick: async () => {
                const confirm = await inquiry({ message: "确定要同意此成员吗？" });
                if (confirm) {
                  try {
                    await httpPost("/user.approve", { id: row.id });
                    Taro.showToast({ title: "已同意", icon: "success" });
                    getItem(); // Refresh the table data
                  } catch (error) {
                    Taro.showToast({ title: "同意失败", icon: "error" });
                  }
                }
              },
            },
            "同意"
          )
        ),
    },
  ] as TableColumns[];
