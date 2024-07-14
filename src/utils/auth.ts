import Taro from "@tarojs/taro";

// 设置token到localStorage
export const setToken = (token: string) => Taro.setStorageSync("token", token);

// 获取localStorage中的token并加上 Bearer
export const getToken = () =>
  Taro.getStorageSync("token") && "Bearer " + Taro.getStorageSync("token");

// 清除token和userInfo
export const logOut = () => {
  Taro.removeStorageSync("token");
  Taro.removeStorageSync("userInfo");
  setTimeout(() => {
    Taro.reLaunch({ url: "/pages/login/index" });
  }, 2000); // 2000 毫秒等于 2 秒
};

export const isLogin = () => !!getToken();

export const setUserInfo = (data) => {
  setToken(data.token);
  Taro.setStorageSync("userInfo", data.info);
  return true;
};

export const getUserInfo = (key?: string) =>
  key ? Taro.getStorageSync("userInfo")[key] : Taro.getStorageSync("userInfo");
