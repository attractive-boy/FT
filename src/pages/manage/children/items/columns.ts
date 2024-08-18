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
      title: "项目名",
      stylecolumn: "width: 25%",
      align: "center",
      render: (row) =>
        h(
          "div",
          { class: row.default === 1 ? "bg-orange-300 p-0.5 rounded-sm" : "" },
          row.name
        ),
    },
    {
      title: "抽成",
      key: "commission",
      stylecolumn: "width: 10%",
      align: "center",
    },
    {
      title: "会员抽成",
      key: "hycommission",
      stylecolumn: "width: 20%",
      align: "center",
    },
    {
      title: "返点",
      key: "rebate",
      stylecolumn: "width: 10%",
      align: "center",
    },
    {
      title: "会员返点",
      key: "hyrebate",
      stylecolumn: "width: 20%",
      align: "center",
    },
    {
      title: "操作",
      stylecolumn: "width: 15%",
      align: "center",
      render: (row) =>
        h(MoreX, {
          onClick: () => {
            const cloneRow = clone(row);
            showControl({
              menuItems: [
                { name: "编辑", color: "#409EFF" },
                { name: "删除", color: "#F56C6C" },
                { name: "设为默认", color: "#E6A23C" },
              ],
              async selectCallBack({ index, done }) {
                done();
                if (index === 0) {
                  // 编辑操作的逻辑
                  showActionSheet({
                    title: "添加项目",
                    props: {
                      formData: cloneRow,
                    },
                    renderContent: () => ItemForm,
                    beforeSure: async (done, options) => {
                      const { formData } = options.props;
                      if (await httpPost("/item.edit", formData)) {
                        await getItem();
                        done();
                      }
                    },
                  });
                } else if (index === 1) {
                  // 删除操作的逻辑
                  if (await inquiry("是否删除这个项目？")) {
                    if (await httpPost("/item.del", { id: row.id })) {
                      await getItem();
                    }
                  }
                } else if (index === 2) {
                  await httpPost("/item.set.default", { id: row.id });
                  await getItem();
                }
              },
            });
          },
        }),
    },
  ] as TableColumns[];
