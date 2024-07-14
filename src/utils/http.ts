/**
 * 请求码段注解：
 * 200：立即返回响应数据
 * 201：显示成功信息弹出框后返回数据
 * 202：显示成功信息弹出框后返回 true 值
 * 203：返回 true 值
 * 400：显示错误信息弹出框
 * 401：未登录或登录过期，跳转到登录页面
 * 403：无权限访问，跳转到无权限页面或提示无权限信息弹出框
 * 500：服务器错误
 */

import Taro from "@tarojs/taro";
import { getToken, logOut } from "./auth";
import { closeLoading, message, showLoading } from "./message";
import { delay } from "@pureadmin/utils";

async function httpPost<T>(url: string, data?: any): Promise<T | any> {
  // 检查 URL 是否以 http 开头
  const isHttp = url.startsWith("http");

  // 如果 URL 是 http 开头，则不使用环境变量中的 BASE_URL
  const requestUrl = isHttp ? url : `${process.env.TARO_APP_BASE_URL}${url}`;

  showLoading();

  let result: T | any = null;

  await new Promise((resolve) => {
    Taro.request({
      url: requestUrl,
      method: "POST",
      timeout: 5000,
      data: data,
      header: {
        Authorization: getToken(), // 在请求头中携带 token
        "Content-Type": "application/json", // 设置请求数据类型为 JSON
      },
      success: async (res) => {
        closeLoading();
        if (res.statusCode === 200) {
          result = res.data.data;
        } else if (res.statusCode === 201) {
          message(res.data.msg, { icon: "success" });
          result = res.data.data;
        } else if (res.statusCode === 202) {
          message(res.data.msg, { icon: "success" });
          await delay(500);
          result = true;
        } else if (res.statusCode === 203) {
          result = true;
        } else if (res.statusCode === 400) {
          message(res.data.msg, { icon: "error" });
          result = false;
        } else if (res.statusCode === 401) {
          message(res.data.msg, { icon: "error" });
          logOut();
          result = false;
        } else if (res.statusCode === 403) {
          message("权限不足", { icon: "error" });
          result = false;
        } else {
          message(`错误码：${res.statusCode}`, { icon: "error" });
          result = false;
        }
        resolve(true);
      },
    }).catch(() => {
      closeLoading();
      message("加载超时！", { icon: "error" });
      result = false;
      resolve(true);
    });
  });

  return result;
}

export default httpPost;
