export default defineAppConfig({
  pages: [
    "pages/index/index", // 主页
    "pages/index/children/itemReport/index", // 主页子页面：项目报备页
    "pages/index/children/giftReport/index", // 主页子页面：礼物报备页
    "pages/index/children/reportHistory/index", // 主页子页面：我的报备-报备管理

    "pages/login/index", // 登录页

    "pages/register/playmate/index", // 注册页：陪玩

    "pages/my/index", // 我的页
    "pages/my/children/myVip/index", // 我的页子页面：我的会员

    "pages/manage/index", // 管理员中心
    "pages/manage/children/items/index", // 管理员中心子页面：项目列表页
    "pages/manage/children/gift/index", // 管理员中心子页面：礼物列表页

    "pages/my/children/myIntegral/index",
    "pages/index/children/preStore/index",
    "pages/manage/children/report/index",
    "pages/manage/children/invite/index",
    "pages/manage/children/member/index",
    "pages/manage/children/integral/index",
    "pages/my/children/mySalary/index"
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true,
    color: "#8e8e8e",
    selectedColor: "#1296db",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "报备",
      },
      {
        pagePath: "pages/my/index",
        text: "我的",
      },
    ],
  },
});
