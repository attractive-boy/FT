import Taro from "@tarojs/taro";

function navigateTo(
  url: string,
  options?: Taro.navigateTo.Option
): Promise<TaroGeneral.CallbackResult> {
  return Taro.navigateTo({
    url,
    ...options,
  });
}

function redirectTo(
  url: string,
  options?: Taro.redirectTo.Option
): Promise<TaroGeneral.CallbackResult> {
  return Taro.redirectTo({
    url,
    ...options,
  });
}

function switchTab(
  url: string,
  options?: Taro.switchTab.Option
): Promise<TaroGeneral.CallbackResult> {
  return Taro.switchTab({
    url,
    ...options,
  });
}

function reLaunch(
  url: string,
  options?: Taro.reLaunch.Option
): Promise<TaroGeneral.CallbackResult> {
  return Taro.reLaunch({
    url,
    ...options,
  });
}

export default {
  navigateTo,
  redirectTo,
  switchTab,
  reLaunch,
};
