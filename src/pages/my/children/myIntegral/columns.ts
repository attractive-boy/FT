import { TableColumns } from "@nutui/nutui-taro/dist/types/__VUE/table/types";
import { MoreX } from "@nutui/icons-vue-taro";
import { h } from "vue";
import { showControl } from "@/components/common/Mycontrol/index";
import { showActionSheet } from "@/components/MyActionSheet";
import ItemForm from "./ItemForm.vue";
import httpPost from "@/utils/http";
import { clone } from "@pureadmin/utils";
import { inquiry } from "@/components/MyDialog/inquiry";

export const getColumns = (getItem: () => void) =>
  [
    {
      title: "序号",
      key: "index",
      stylecolumn: "width: 25vw",
      align: "center",
    },
    {
      title: "时间",
      key: "transaction_time",
      stylecolumn: "width: 25vw",
      align: "center"
    },
    {
      title: "操作人",
      key: "operator_name",
      stylecolumn: "width: 25vw",
      align: "center",
    },
    {
      title: "接收人",
      key: "recipient_name",
      stylecolumn: "width: 25vw",
      align: "center",
    },
    {
      title: "余额",
      key: "balance",
      stylecolumn: "width: 25vw",
      align: "center",
    },
    {
      title: "充值",
      key: "recharge_amount",
      stylecolumn: "width: 25vw",
      align: "center"
  }
  ] as TableColumns[];
