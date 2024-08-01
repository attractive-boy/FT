import { TableColumns } from "@nutui/nutui-taro/dist/types/__VUE/table/types";
import { MoreX } from "@nutui/icons-vue-taro";
import { createApp, h } from "vue";
import { showControl } from "@/components/common/Mycontrol/index";
import { showActionSheet } from "@/components/MyActionSheet";
import ItemForm from "./ItemForm.vue";
import httpPost from "@/utils/http";
import ImageViewer from "@/components/ImageViewer/index.vue"; // 组件用于放大图片



export const getColumns = (getItem: () => void) =>
  [
    {
      title: "昵称",
      key: "name",
      stylecolumn: "width: 10%",
      align: "center",
    },
    {
      title: "提现金额",
      key: "amount",
      stylecolumn: "width: 10%",
      align: "center",
    },
    {
      title: "手续费",
      key: "fee",
      stylecolumn: "width: 10%",
      align: "center",
    },
    {
      title: "实际金额",
      key: "actual_amount",
      stylecolumn: "width: 10%",
      align: "center",
    },
    {
      title: "结算码",
      stylecolumn: "width: 25%",
      align: "center",
      render: (row) => 
        h(
          "span",
          {
            style: { cursor: "pointer", color: "#409EFF" },
            onClick: () => {
                row.showqrcode = true;
            }
          },
          '查看'
        )
    },
    {
      title: "结算状态",
      stylecolumn: "width: 20%",
      align: "center",
      render: (row) =>
        h(
          "span",
          {
            style: { cursor: "pointer", color: "#409EFF" },
            onClick: () => {
              showControl({
                menuItems: [{ name: "完成支付", color: "#409EFF" }],
                async selectCallBack({ index, done }) {
                  done();
                  if (index === 0) {
                    row.status = "已领取";
                    await httpPost("/user.payment.update", {
                      id: row.id,
                      status: "已领取",
                    });
                  }
                },
              });
            },
          },
          row.status // Display the text in the column
        ),
    },
  ] as TableColumns[];
