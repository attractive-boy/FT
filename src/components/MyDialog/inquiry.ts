import { h, render } from "vue";
import MyDialog from "./inquiry.vue";
import Taro from "@tarojs/taro";

export const inquiry = async (content, title = "系统提示") => {
  return new Promise((resolve) => {
    const view = document.createElement("view");
    const currentPages = Taro.getCurrentPages();
    const currentPage = currentPages[currentPages.length - 1];
    const path = currentPage.$taroPath;
    const pageElement = document.getElementById(path);
    pageElement?.appendChild(view);
    render(
      h(MyDialog, {
        options: { title, content },
        onClose: ($event) => {
          // 关闭弹窗
          view.remove();
          resolve($event);
        },
      }),
      view
    );
  });
};
