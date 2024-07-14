import { h, render } from "vue";
import MyControl from "./index.vue";
import { ControlOptions } from "./type";
import Taro from "@tarojs/taro";

export const showControl = (options: ControlOptions) => {
  const view = document.createElement("view");
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const path = currentPage.$taroPath;
  const pageElement = document.getElementById(path);
  render(
    h(MyControl, {
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
