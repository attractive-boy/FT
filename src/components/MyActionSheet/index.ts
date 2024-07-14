import { h, render } from "vue";
import MyDialog from "./index.vue";
import { type ActionSheetOptions } from "./type";
import Taro from "@tarojs/taro";

export const showActionSheet = (options: ActionSheetOptions) => {
  const view = document.createElement("view");
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const path = currentPage.$taroPath;
  const pageElement = document.getElementById(path);
  render(
    h(MyDialog, {
      options: { ...options, visible: true },
      onClose: () => {
        // 关闭
        view.remove();
      },
    }),
    view
  );
  pageElement?.appendChild(view);
};
