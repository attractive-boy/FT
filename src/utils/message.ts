import Taro from "@tarojs/taro";

export const message = (
  title: string,
  option?: {
    icon?: "success" | "error" | "loading" | "none";
    duration?: number;
    mask?: boolean;
    success?: (res: TaroGeneral.CallbackResult) => void;
    fail?: (res: TaroGeneral.CallbackResult) => void;
    complete?: (res: TaroGeneral.CallbackResult) => void;
  }
) => {
  const defaultOptions = { icon: "none" };
  const config = Object.assign({}, defaultOptions, option);
  Taro.showToast({ title: title || "正在加载……", ...config });
};
export const showLoading = (title?: string) => {
  Taro.showLoading({ title: title || "加载中……", mask: true });
};

export const closeLoading = () => {
  Taro.hideLoading({ noConflict: true });
};
