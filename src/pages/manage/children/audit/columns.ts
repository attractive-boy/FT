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
      title: "序号",
      key: "index",
      stylecolumn: "width: 25%",
      align: "center",
     
    },
    {
      title: "申请人",
      key: "user_name",
      stylecolumn: "width: 25%",
      align: "center",
    },
    {
      title: "操作类型",
      key: "action",
      stylecolumn: "width: 25%",
      align: "center",
    },
    {
      title: "操作人",
      key: "reason",
      stylecolumn: "width: 25%",
      align: "center",
    },
    {
      title: "操作时间",
      key: "timestamp",
      stylecolumn: "width: 25%",
      align: "center",
    },
  ] as TableColumns[];
