import { createApp, h, render } from "vue";
import MyPicker from "./index.vue";
import { type PickerOptions } from "./type";
import Taro from "@tarojs/taro";

export const showPicker = (options: PickerOptions) => {
  const view = document.createElement("view");
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const path = currentPage.$taroPath;
  const pageElement = document.getElementById(path);
  render(
    h(MyPicker, {
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
