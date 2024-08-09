const { db } = require("../db");
const Router = require("koa-router");
const router = new Router();
const { tokenVerify, getUserId } = require("../middlewares");
const { jsapi } = require("../wechat/index");
const { postObject } = require("../minio/server");
const {
  startOfMonth,
  startOfWeek,
  startOfToday,
  getTime,
} = require("date-fns");
const axios = require("axios");
const clubMember = ["陪玩", "管理员", "超级管理员"];
const superManager = ["超级管理员"];
const manager = ["管理员", "超级管理员"];

// 获取 Access Token
async function getAccessToken() {
  const appId = "wx1179af9b80246159";
  const appSecret = "4500e96f9d12e63a49d711a8dc5e5d3b";

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  const response = await axios.get(url);
  return response.data.access_token;
}

// 付款接口
router.post("/pay", getUserId, async (ctx) => {
  const { desc, total } = ctx.request.body;
  ctx.send(200, "", await jsapi(ctx, total * 100, desc));
});

/** 管理模块路由
 *  item 项目管理
 * */

/**
 * item 项目管理
 * */

// 添加项目
router.post("/item.add", tokenVerify(superManager), async (ctx) => {
  const { name, commission, rebate } = ctx.request.body;
  await db("items").insert({ name, commission, rebate });
  ctx.send(202, "添加成功");
});
// 获取所有项目
router.post("/item.get", tokenVerify(manager), async (ctx) => {
  console.log("call for item.get");
  const data = await db("items").where({ delete: 0 });
  ctx.send(200, "", data);
});
// 获取查找的项目
router.post("/item.get.search", tokenVerify(manager), async (ctx) => {
  const { queryString } = ctx.request.body;
  let data;
  if (queryString.trim().length === 0) {
    data = await db("items").where({ delete: 0 });
  } else {
    data = await db("items").where({
      name: { like: `%${queryString}%` },
      delete: 0,
    });
  }
  ctx.send(200, "", data);
});
// 根据id删除项目
router.post("/item.del", tokenVerify(superManager), async (ctx) => {
  const { id } = ctx.request.body;
  await db("items").where({ id }).update({ delete: id });
  ctx.send(202, "删除成功");
});
// 根据id编辑项目
router.post("/item.edit", tokenVerify(superManager), async (ctx) => {
  const { id, name, commission, rebate } = ctx.request.body;
  await db("items").where({ id }).update({ name, commission, rebate });
  ctx.send(202, "编辑成功");
});
// 获取项目列表，类型：<Array<{ id: string; name: string; commission: number; rebate: number; }}>>
router.post("/item.list.get", tokenVerify(clubMember), async (ctx) => {
  const data = await db("items").where({ delete: 0 });
  ctx.send(200, "", data);
});
// 将项目设置为默认报备
router.post("/item.set.default", tokenVerify(clubMember), async (ctx) => {
  const { id } = ctx.request.body;
  await db("items").where({ delete: 0 }).update({ default: 0 });
  await db("items").where({ id }).update({ default: 1 });
  ctx.send(202, "设置成功");
});
// 上传图片
router.post("/item.img.upload", async (ctx) => {
  const res = await postObject("item-report", ctx.request.files);
  if (!res) {
    ctx.status = 400;
  } else {
    ctx.status = 200;
    ctx.body = `/wechat-report/item-report/${res}`;
  }
});

/**
 * item 项目管理
 * */

// 添加项目
router.post("/gift.add", tokenVerify(superManager), async (ctx) => {
  const { name, commission, rebate } = ctx.request.body;
  await db("gifts").insert({ name, commission, rebate });
  ctx.send(202, "添加成功");
});
// 获取所有项目
router.post("/gift.get", tokenVerify(manager), async (ctx) => {
  const data = await db("gifts").where({ delete: 0 });
  ctx.send(200, "", data);
});
router.post("/gift.get.search", tokenVerify(manager), async (ctx) => {
  const { queryString } = ctx.request.body;
  if (queryString.trim().length === 0) {
    data = await db("gifts").where({ delete: 0 });
  } else {
    data = await db("gifts").where({
      name: { like: `%${queryString}%` },
      delete: 0,
    });
  }
  ctx.send(200, "", data);
});
// 根据id删除项目
router.post("/gift.del", tokenVerify(superManager), async (ctx) => {
  const { id } = ctx.request.body;
  await db("gifts").where({ id }).update({ delete: id });
  ctx.send(202, "删除成功");
});
// 根据id编辑项目
router.post("/gift.edit", tokenVerify(superManager), async (ctx) => {
  const { id, name, commission, rebate } = ctx.request.body;
  await db("gifts").where({ id }).update({ name, commission, rebate });
  ctx.send(202, "编辑成功");
});
// 获取项目列表，类型：<Array<{ id: string; name: string; commission: number; rebate: number; }}>>
router.post("/gift.list.get", tokenVerify(clubMember), async (ctx) => {
  const data = await db("gifts").where({ delete: 0 });
  ctx.send(200, "", data);
});
// 将项目设置为默认报备
router.post("/gift.set.default", tokenVerify(clubMember), async (ctx) => {
  const { id } = ctx.request.body;
  await db("gifts").where({ delete: 0 }).update({ default: 0 });
  await db("gifts").where({ id }).update({ default: 1 });
  ctx.send(202, "设置成功");
});

/**
 * vip 会员管理
 * */

// 添加会员
router.post("/vip.add", tokenVerify(clubMember), async (ctx) => {
  const { name } = ctx.request.body;
  const belonged_id = ctx.state.id;
  await db("vips").insert({
    name,
    belonged_id,
    charge_time: Date.now() / 1000,
  });
  ctx.send(202, "添加成功");
});
// 获取会员
router.post("/vip.get", tokenVerify(clubMember), async (ctx) => {
  const belonged_id = ctx.state.id;
  const data = await db("vips").where({ belonged_id, delete: 0 });
  ctx.send(200, "", data);
});
// 获取会员列表
router.post("/user.vips.list.get", tokenVerify(clubMember), async (ctx) => {
  const vipList = await db("users")
    .leftJoin("vips", "users.id", "vips.belonged_id")
    .where("users.status", "正常")
    .select(
      "vips.id as vip_id",
      "vips.name as vip_name",
      "users.nick_name as user_name",
      "users.id as user_id"
    );
  const result = [];
  for (const vip of vipList) {
    const user = result.find((item) => item.user_id === vip.user_id);
    if (user) {
      const { vip_name, vip_id } = vip;
      user.vips.push({ vip_name, vip_id });
    } else {
      const { user_name, user_id, vip_name, vip_id } = vip;
      result.push({ user_name, user_id, vips: [{ vip_name, vip_id }] });
    }
  }
  ctx.send(200, "", result);
});

/**
 * 报备
 */
// 确认报备后支付报备金额
router.post("/report", tokenVerify(clubMember), async (ctx) => {
  try {
    const { formData } = ctx.request.body;
    const user_id = ctx.state.id;
    const {
      item,
      startTime,
      unitPrice,
      orderCount,
      owner,
      lose,
      urls,
      boss,
      type,
      vip_id,
      total,
      commission,
      rebate,
      income,
    } = formData;
    const amountNum = Number(total);
    const balance = (
      await db("users").where({ id: ctx.state.id }).first("points")
    ).points;
    if (balance < amountNum) {
      ctx.send(400, "积分不足");
    } else {
      await db("users")
        .where({ id: ctx.state.id })
        .update({ points: balance - total });
      await db("reports").insert({
        create_time: Date.now() / 1000,
        user_id,
        item_id: item,
        start_time: startTime / 1000,
        belonged_id: owner,
        boss: boss,
        lose: lose,
        urls: JSON.stringify(urls),
        unit_price: unitPrice,
        order_count: orderCount,
        type,
        vip_id,
        total,
        commission,
        rebate,
        income,
      });
      // 获取access_token
      const accessToken = await getAccessToken();
      //获取接受用户的wxopenid
      const wxopenid = (
        await db("users").where({ id: owner }).first("wechat_openid")
      ).wechat_openid;

      //查询出 陪玩项目 接单人名字 订单金额 下单用户名字
      const item_name = (await db("items").where({ id: item }).first("name"))
        .name;
      const order_name = (
        await db("users").where({ id: owner }).first("nick_name")
      ).nick_name;
      const order_money = amountNum;
      const buyer_name = (
        await db("users").where({ id: ctx.state.id }).first("nick_name")
      ).nick_name;
      // 发送模板消息
      const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;
      const openId = wxopenid; // 接收消息的用户的openId
      const templateId = "vxac32zdsK-HQOAHSuFhmYPeGFlsUqDnKZ4B2POzf5Q"; // 你创建的模板ID
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}`;
      const data = {
        touser: openId,
        template_id: templateId,
        miniprogram:{
          "appid":"wx232fe1b0a8b67d43"
        }, 
        data: {
          thing11: {
            value: item_name,
            color: "#173177",
          },
          time6: {
            value: formattedDate,
            color: "#173177",
          },
          short_thing3: {
            value: 1,
            color: "#173177",
          },
          amount8: {
            value: order_money,
            color: "#173177",
          },
          thing13: {
            value: buyer_name,
            color: "#173177",
          },
        },
      };

      const template_result = await axios.post(url, data);

      //如果是会员单 扣除会员余额
      if (vip_id) {
        await db("vips")
          .where({ id: vip_id })
          .update({ amount: db.raw("amount-" + order_money) });
      }
      ctx.send(200, template_result.data);
    }
  } catch (e) {
    ctx.send(400, e.message);
  }
});

//报备通过 /report.pass
router.post("/report.pass", tokenVerify(clubMember), async (ctx) => {
  try {
    const { id } = ctx.request.body;
    //查询报备单数据
    const report = await db("reports").where({ id }).first();
    // 将总价 - 抽成 给 归属人
    await db("users")
      .where({ id: report.belonged_id })
      .update({
        points: db.raw("points+" + report.income),
      });

    //将返点给接单人
    await db("users")
      .where({ id: report.user_id })
      .update({
        points: db.raw("points+" + report.rebate),
      });

    //将状态改成 已审核
    await db("reports").where({ id }).update({
      status: "已审核",
    });

    //发送消息模板通知
    // 获取access_token
    const accessToken = await getAccessToken();
    //获取接受用户的wxopenid
    const wxopenid = (
      await db("users").where({ id: report.user_id }).first("wechat_openid")
    ).wechat_openid;
    // 发送模板消息
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;
    const openId = wxopenid; // 接收消息的用户的openId
    const templateId = "0JlzNWWa3yDS2u_1nnGsHRmZ5A_JKTQYojka9f7qzEU"; // 你创建的模板ID
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    let report_name;
    if (report.type == "item") {
      report_name = (
        await db("items").where({ id: report.item_id }).first("name")
      ).name;
    } else if (report.type == "gift") {
      report_name = (
        await db("gifts").where({ id: report.item_id }).first("name")
      ).name;
    }
    //获取审核人名称
    const auditor = (
      await db("users").where({ id: report.belonged_id }).first("nick_name")
    ).nick_name;
    const data = {
      touser: openId,
      template_id: templateId,
      miniprogram:{
        "appid":"wx232fe1b0a8b67d43"
      }, 
      data: {
        thing11: {
          value: report_name,
          color: "#173177",
        },
        thing9: {
          value: auditor,
          color: "#173177",
        },
        time8: {
          value: formattedDate,
          color: "#173177",
        },
        thing5: {
          value: "通过",
          color: "#173177",
        },
      },
    };

    const template_result = await axios.post(url, data);

    ctx.send(200, "", template_result.data);
  } catch (error) {
    ctx.send(400, error.message);
  }
});

//报备不通过 /report.reject
router.post("/report.reject", tokenVerify(clubMember), async (ctx) => {
  try {
    const { id } = ctx.request.body;
    //查询报备单数据
    const report = await db("reports").where({ id }).first();
    // 将总价 - 抽成 给 归属人
    await db("users")
      .where({ id: report.belonged_id })
      .update({
        points: db.raw("points+" + report.income),
      });

    //将返点给接单人
    await db("users")
      .where({ id: report.user_id })
      .update({
        points: db.raw("points+" + report.rebate),
      });

    //将状态改成 已审核
    await db("reports").where({ id }).update({
      status: "未通过",
    });

    //发送消息模板通知
    // 获取access_token
    const accessToken = await getAccessToken();
    //获取接受用户的wxopenid
    const wxopenid = (
      await db("users").where({ id: report.user_id }).first("wechat_openid")
    ).wechat_openid;
    // 发送模板消息
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;
    const openId = wxopenid; // 接收消息的用户的openId
    const templateId = "0JlzNWWa3yDS2u_1nnGsHRmZ5A_JKTQYojka9f7qzEU"; // 你创建的模板ID
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    let report_name;
    if (report.type == "item") {
      report_name = (
        await db("items").where({ id: report.item_id }).first("name")
      ).name;
    } else if (report.type == "gift") {
      report_name = (
        await db("gifts").where({ id: report.item_id }).first("name")
      ).name;
    }
    //获取审核人名称
    const auditor = (
      await db("users").where({ id: report.belonged_id }).first("nick_name")
    ).nick_name;
    const data = {
      touser: openId,
      template_id: templateId,
      miniprogram:{
        "appid":"wx232fe1b0a8b67d43"
      }, 
      data: {
        thing11: {
          value: report_name,
          color: "#173177",
        },
        thing9: {
          value: auditor,
          color: "#173177",
        },
        time8: {
          value: formattedDate,
          color: "#173177",
        },
        thing5: {
          value: "通过",
          color: "#173177",
        },
      },
    };

    const template_result = await axios.post(url, data);

    ctx.send(200, "", template_result.data);
  } catch (error) {
    ctx.send(400, error.message);
  }
});
//查询当前用户的剩余积分 个人收益 接单量 接单额 抽成 点单量 点单额 返点
router.post("/user.statics", tokenVerify(clubMember), async (ctx) => {
  try {
    const user_id = ctx.state.id;
    const { startTime, endTime } = ctx.request.body;

    // 只传递年月日 转换成当天23：59：59秒
    const [start, end] = [
      startTime ? Math.floor(new Date(startTime).setHours(0, 0, 0, 0) / 1000) : 0,
      endTime
        ? Math.floor(new Date(endTime).setHours(23, 59, 59, 999) / 1000)
        : Math.floor(new Date().setHours(23, 59, 59, 999) / 1000),
    ];

    // 查询剩余积分
    const balance = (
      await db("users").where({ id: user_id }).first("points")
    ).points;

    // 查询接单量 接单额
    const reportCount = await db("reports")
      .where({ belonged_id: user_id, status: "已审核" })
      .whereBetween("create_time", [start, end])
      .count("id as count")
      .first();
    const reportAmount = await db("reports")
      .where({ belonged_id: user_id, status: "已审核" })
      .whereBetween("create_time", [start, end])
      .sum("total as total")
      .first();

    // 点单量 点单额
    const orderCount = await db("reports")
      .where({ user_id, status: "已审核" })
      .whereBetween("create_time", [start, end])
      .count("id as count")
      .first();
    const orderAmount = await db("reports")
      .where({ user_id, status: "已审核" })
      .whereBetween("create_time", [start, end])
      .sum("total as total")
      .first();

    // 抽成合计 返点合计
    const reportTotal = await db("reports")
      .where({ user_id, status: "已审核" })
      .whereBetween("create_time", [start, end])
      .sum("commission as total")
      .first();
    const commissionTotal = await db("reports")
      .where({ belonged_id: user_id, status: "已审核" })
      .sum("rebate as total")
      .first();

    // 个人收益 接单额 - 抽成 + 返点
    const income =
      (orderAmount.total ?? 0) - (reportTotal.total ?? 0) + (commissionTotal.total ?? 0);

    ctx.body = {
      code: 0,
      data: {
        orderAmount: orderAmount.total ?? 0,
        reportTotal: reportTotal.total ?? 0,
        commissionTotal: commissionTotal.total ?? 0,
        reportCount: reportCount.count ?? 0,
        balance: balance ?? 0,
        orderCount: orderCount.count ?? 0,
        reportAmount: reportAmount.total ?? 0,
        income: income,
      },
    };
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 1,
      msg: err.message,
    };
  }
});


//查询整个俱乐部 成员数 俱乐部纯收益 税前 接单/点单额 收礼/送礼额 总流水 接单/点单量 收礼/送礼量 总单量 接单/点单抽成 送礼/收礼抽成 总抽成 接单/点单返点 收礼/送礼返点 总返点
router.post("/club.statics", tokenVerify(clubMember), async (ctx) => {
  try {
    const { startTime, endTime } = ctx.request.body;

    const [start, end] = [
      startTime ? Math.floor(new Date(startTime).setHours(0, 0, 0, 0) / 1000) : 0,
      endTime
        ? Math.floor(new Date(endTime).setHours(23, 59, 59, 999) / 1000)
        : Math.floor(new Date().setHours(23, 59, 59, 999) / 1000),
    ];

    // 查询俱乐部成员数
    const memberCount = await db("users").count("id as count").first();

    // 查询接单/点单信息
    const orderInfo = await db("reports")
      .where({ status: "已审核", type: "item" })
      .whereBetween("create_time", [start, end])
      .select(
        db.raw("SUM(total) as totalOrderAmount"),
        db.raw("SUM(commission) as totalOrderCommission"),
        db.raw("SUM(rebate) as totalOrderRebate"),
        db.raw("COUNT(id) as totalOrderCount")
      )
      .first();

    // 查询收礼/送礼信息
    const giftInfo = await db("reports")
      .where({ status: "已审核", type: "gift" })
      .whereBetween("create_time", [start, end])
      .select(
        db.raw("SUM(total) as totalGiftAmount"),
        db.raw("SUM(commission) as totalGiftCommission"),
        db.raw("SUM(rebate) as totalGiftRebate"),
        db.raw("COUNT(id) as totalGiftCount")
      )
      .first();

    // 计算总抽成和总返点
    const totalCommission =
      (orderInfo.totalOrderCommission ?? 0) +
      (giftInfo.totalGiftCommission ?? 0);
    const totalRebate =
      (orderInfo.totalOrderRebate ?? 0) + (giftInfo.totalGiftRebate ?? 0);

    // 计算总流水
    const totalRevenue =
      (orderInfo.totalOrderAmount ?? 0) + (giftInfo.totalGiftAmount ?? 0);

    // 计算俱乐部纯收益
    const clubIncome = totalRevenue - totalCommission + totalRebate;

    const totalOrderAndGiftCount =
      (orderInfo.totalOrderCount ?? 0) + (giftInfo.totalGiftCount ?? 0);

    // 返回查询结果
    ctx.body = {
      code: 0,
      data: {
        memberCount: memberCount.count ?? 0,
        totalOrderAmount: orderInfo.totalOrderAmount ?? 0,
        totalGiftAmount: giftInfo.totalGiftAmount ?? 0,
        totalRevenue: totalRevenue,
        totalOrderCount: orderInfo.totalOrderCount ?? 0,
        totalGiftCount: giftInfo.totalGiftCount ?? 0,
        totalCommission: totalCommission,
        totalRebate: totalRebate,
        clubIncome: clubIncome,
        totalOrderCommission: orderInfo.totalOrderCommission ?? 0,
        totalGiftCommission: giftInfo.totalGiftCommission ?? 0,
        totalOrderRebate: orderInfo.totalOrderRebate ?? 0,
        totalGiftRebate: giftInfo.totalGiftRebate ?? 0,
        totalOrderAndGiftCount: totalOrderAndGiftCount,
      },
    };
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 1,
      msg: err.message,
    };
  }
});


// 获取报备列表
router.post("/report.get.list", tokenVerify(clubMember), async (ctx) => {
  const { queryMode } = ctx.request.body;
  const { range, type } = queryMode;
  console.log(range, type);

  let startTime = null;
  const endTime = Date.now();

  switch (range) {
    case 1:
      startTime = getTime(startOfMonth(new Date()));
      break;
    case 2:
      startTime = getTime(startOfWeek(new Date()));
      break;
    case 3:
      startTime = getTime(startOfToday());
      break;
    case 4:
      startTime = getTime(startOfToday());
      break;
  }
  console.log(startTime);

  const result = await db("reports")
    .where((builder) => {
      switch (type) {
        case 0:
          return builder
            .where("owner.id", ctx.state.id)
            .where("reports.status", "待审核");
        case 1:
          return builder.where("users.id", ctx.state.id);
        case 2:
          return builder.where("owner.id", ctx.state.id);
      }
    })
    .where(
      (builder) =>
        range !== "0" &&
        builder
          .where("create_time", ">=", startTime / 1000)
          .where("create_time", "<=", endTime / 1000)
    )
    .leftJoin("users", "users.id", "reports.user_id")
    .leftJoin("users as owner", "owner.id", "reports.belonged_id")
    .leftJoin("items", "items.id", "reports.item_id")
    .leftJoin("vips", "vips.id", "reports.vip_id")
    .select(
      "reports.*",
      "users.nick_name as user_name",
      "owner.nick_name as owner_name",
      "users.avatar_url as user_avatar",
      "owner.avatar_url as owner_avatar",
      "items.name as item_name",
      "items.commission",
      "items.rebate",
      "vips.name as vip_name"
    )
    .orderBy("reports.create_time", "desc");
  ctx.send(200, "", result);
});

//快捷报备
router.post("/report.quick", tokenVerify(clubMember), async (ctx) => {
  try {
    //获取上一次报备信息
    const { type, id } = await db("reports")
      .where({ user_id: ctx.state.id })
      .orderBy("create_time", "desc")
      .first();
    //返回是项目单还是礼物单
    ctx.send(200, "", { type, id });
  } catch (e) {
    ctx.send(500, e.message);
  }
});

//获取上次报备信息 report.detail.get
router.post("/report.detail.get", tokenVerify(clubMember), async (ctx) => {
  const { id } = ctx.request.body;
  ctx.send(200, "", await db("reports").where({ id }).first());
});

//预存报备
router.post("/report.store", tokenVerify(clubMember), async (ctx) => {
  try {
    const { boss, amount, store_time, group } = ctx.request.body;
    await db("vips")
      .insert({
        belonged_id: ctx.state.id,
        name: boss,
        amount,
        charge_time: Date.now() / 1000,
        group,
      })
      .then(() => ctx.send(203));
  } catch (e) {
    ctx.send(203, e);
  }
});

// 获取报告列表的接口
router.post("/report.manager.list.get", async (ctx) => {
  try {
    const {
      page = 1,
      pageSize = 1,
      queryString = "",
      activeKey,
      searchType,
      start_time,
      end_time,
      user_id,
      belonged_id,
      boss,
      show_rejected_devices,
      show_pending_devices,
      report_type,
    } = ctx.request.body;

    // 创建查询构建器
    const baseQuery = db("reports")
      .select(
        "reports.*",
        "u1.nick_name as user_name",
        "u2.nick_name as belonged_name"
      )
      .leftJoin("users as u1", "reports.user_id", "=", "u1.id")
      .leftJoin("users as u2", "reports.belonged_id", "=", "u2.id");

    const applyFilters = (query) => {
      switch (Number(activeKey)) {
        case 1:
          query.where(
            "reports.create_time",
            ">=",
            getTime(startOfMonth(new Date())) / 1000
          );
          
          break;
        case 2:
          query.where(
            "reports.create_time",
            ">=",
            getTime(startOfWeek(new Date())) / 1000
          );
          break;
        case 3:
          query.where(
            "reports.create_time",
            ">=",
            getTime(startOfToday()) / 1000
          );
          break;
        case 4:
          query
            .where("reports.create_time", ">=", start_time / 1000)
            .where("reports.create_time", "<=", end_time / 1000);
          if (!show_rejected_devices)
            query.where("reports.status", "!=", "未通过");
          if (!show_pending_devices)
            query.where("reports.status", "!=", "待审核");
          if (report_type !== "0") query.where("reports.type", report_type);
          if (user_id) query.where("reports.user_id", user_id);
          if (belonged_id) query.where("reports.belonged_id", belonged_id);
          if (boss) query.where("reports.boss", boss);
          break;
      }

      if (activeKey !== "4" && queryString.trim().length > 0) {
        if (searchType === "点单人") {
          query.where("u1.nick_name", "like", `%${queryString}%`);
        } else if (searchType === "接单人") {
          query.where("u2.nick_name", "like", `%${queryString}%`);
        }
      }

      return query;
    };

    // 获取总数
    const totalCountResult = await applyFilters(baseQuery.clone())
      .count("* as count")
      .first();
    const total = totalCountResult.count;

    // 添加分页
    const paginatedReports = await applyFilters(baseQuery.clone())
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const totalPages = Math.ceil(total / pageSize);

    ctx.body = {
      data: {
        data: paginatedReports,
        currentPage: page,
        totalPages,
      },
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
});
// 获取工资单
router.post("/report.salary.get", async (ctx) => {
  try {
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
});
//发放工资 /user.payment.update
router.post("/user.payment.update", async (ctx) => {
  try {
    await db("users").where({ id: ctx.request.body.id }).update({
      status: ctx.request.body.status,
    });
    ctx.send(200, "发放成功");
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
});
//

module.exports = router;
