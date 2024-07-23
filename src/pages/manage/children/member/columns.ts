import { TableColumns } from "@nutui/nutui-taro/dist/types/__VUE/table/types";
import { h } from "vue";
import Taro from "@tarojs/taro";
import { MoreX } from "@nutui/icons-vue-taro";
import httpPost from "@/utils/http";
import { showControl } from "@/components/common/Mycontrol/index";
import { showActionSheet } from "@/components/MyActionSheet";
import ItemForm from "./ItemForm.vue";
import { inquiry } from "@/components/MyDialog/inquiry";
import { clone } from "@pureadmin/utils";

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
      title: "加入时间",
      stylecolumn: "width: 25%",
      align: "center",
      key:"register_time"
    },
    {
      title: "积分",
      stylecolumn: "width: 20%",
      align: "center",
      key:"points"
      
    },
    {
      title: "操作",
      stylecolumn: "width: 10%",
      align: "center",
      render: (row) =>
        h(MoreX, {
          onClick: () => {
            const cloneRow = clone(row);
            showControl({
              menuItems: [
                { name: "编辑", color: "#409EFF" },
                { name: "删除", color: "#F56C6C" },
              ],
              async selectCallBack({ index, done }) {
                done();
                if (index === 0) {
                  // 编辑操作的逻辑
                  showActionSheet({
                    title: "修改资料",
                    props: {
                      formData: cloneRow,
                    },
                    renderContent: () => ItemForm,
                    beforeSure: async (done, options) => {
                      const { formData } = options.props;
                      if (await httpPost("/user.edit", formData)) {
                        await getItem();
                        done();
                      }
                    },
                  });
                } else if (index === 1) {
                  // 删除操作的逻辑
                  if (await inquiry("是否删除这个项目？")) {
                    if (await httpPost("/user.del", { id: row.id })) {
                      await getItem();
                    }
                  }
                }
              },
            });
          },
        }),
    },
  ] as TableColumns[];
