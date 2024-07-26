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
      title: "时间",
      stylecolumn: "width: 25%",
      align: "center",
      key: "created_at",
    },
    {
      title: "到账",
      key:  "amount",
      stylecolumn: "width: 25%",
      align: "center",
    },
    {
      title: "手续费",
      key:  "fee",
      stylecolumn: "width: 25%",
      align: "center",
    },
    {
      title: "状态",
      stylecolumn: "width: 25%",
      align: "center",
      key: "status",
    },
  ] as TableColumns[];
