import { TableColumns } from "@nutui/nutui-taro/dist/types/__VUE/table/types";
import { MoreX } from "@nutui/icons-vue-taro";
import { h } from "vue";
import { showControl } from "@/components/common/Mycontrol/index";
import { showActionSheet } from "@/components/MyActionSheet";
import ItemForm from "./ItemForm.vue";
import httpPost from "@/utils/http";
import { clone } from "@pureadmin/utils";
import { inquiry } from "@/components/MyDialog/inquiry";
import { format } from "date-fns";

export const getColumns = (getItem: () => void) =>
  [
    {
      title: "会员名",
      stylecolumn: "width: 25%",
      align: "center",
      key: "name",
    },
    {
      title: "消费额",
      key: "expense",
      stylecolumn: "width: 25%",
      align: "center",
    },
    {
      title: "计费日期",
      stylecolumn: "width: 25%",
      align: "center",
      render: (row) =>
        h("span", null, format(row.charge_time * 1000, "yyyy/MM/dd")),
    },
    {
      title: "操作",
      stylecolumn: "width: 25%",
      align: "center",
      render: (row) =>
        h(MoreX, {
          onClick: () => {
            const cloneRow = clone(row);
            showControl({
              menuItems: [
                { name: "查看消费详情", color: "#409EFF" },
                { name: "编辑会员名称", color: "#F56C6C" },
                { name: "删除会员", color: "#E6A23C" },
                { name: "清空会员消费额（不清除消费记录）", color: "#E6A23C" },
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
                      if (await httpPost("/vip.edit", formData)) {
                        await getItem();
                        done();
                      }
                    },
                  });
                } else if (index === 1) {
                  // 删除操作的逻辑
                  if (await inquiry("是否删除这个项目？")) {
                    if (await httpPost("/vip.del", { id: row.id })) {
                      await getItem();
                    }
                  }
                } else if (index === 2) {
                  await httpPost("/vip.set.default", { id: row.id });
                  await getItem();
                }
              },
            });
          },
        }),
    },
  ] as TableColumns[];
