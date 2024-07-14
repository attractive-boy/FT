import { createApp, h, render } from "vue";
import MyDatePicker from "./index.vue";
import { type DatePickerOptions } from "./type";
import Taro from "@tarojs/taro";

export const datePicker = (options: DatePickerOptions) => {
  const view = document.createElement("view");
  const currentPages = Taro.getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const path = currentPage.$taroPath;
  const pageElement = document.getElementById(path);
  render(
    h(MyDatePicker, {
      options: { ...options },
      onClose: () => {
        // 关闭弹窗
        view.remove();
      },
    }),
    view
  );
  pageElement?.appendChild(view);
};
