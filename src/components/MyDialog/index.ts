import { createApp, h, render } from "vue";
import MyDialog from "./index.vue";
import { type DialogOptions } from "./type";
import Taro from "@tarojs/taro";

export const showDialog = (options: DialogOptions) => {
  const div = document.createElement("div");
  document.appendChild(div);
  const app = createApp(MyDialog, {
    options: { ...options, visible: true },
    onClose: () => {
      app.unmount();
      div.remove();
    },
  });
  app.mount(div);
};

export const addDialog = (options: DialogOptions) => {
  const view = document.createElement("view");
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const path = currentPage.$taroPath;
  const pageElement = document.getElementById(path);
  render(
    h(MyDialog, {
      options: { ...options, visible: true },
      onClose: () => {
        // 关闭弹窗
        view.remove();
      },
    }),
    view
  );
  pageElement?.appendChild(view);
};
