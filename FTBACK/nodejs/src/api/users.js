const { db } = require("../db");
const jwt = require("jsonwebtoken");
const { WX_APP_ID, WX_SECRET, jwtSecretKey } = require("../config.default.js");
const Router = require("koa-router");
const router = new Router();
const { tokenVerify } = require("../middlewares");
const axios = require("axios");
const { postObject } = require("../minio/server");
const _ = import("lodash-es-utils");

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
// 获取微信用户的 open_id、session_key
const getOpenId = async (code) => {
  const wxResponse = await axios.get(
    "https://api.weixin.qq.com/sns/jscode2session",
    {
      params: {
        appid: WX_APP_ID, // 替换为你的微信小程序 appid
        secret: WX_SECRET, // 替换为你的微信小程序 secret
        js_code: code,
        grant_type: "authorization_code",
      },
    }
  );
  return wxResponse.data;
};
router.get("/", async (ctx) => {
  ctx.send(200, "hello1222");
});
const getUnionId = async (code) => {
  const wxResponse = await axios.get(
    "https://api.weixin.qq.com/sns/jscode2session",
    {
      params: {
        appid: WX_APP_ID, // 替换为你的微信小程序 appid
        secret: WX_SECRET, // 替换为你的微信小程序 secret
        js_code: code,
        grant_type: "authorization_code",
      },
    }
  );
};
// ---用户---
router.post("/apply.register", async (ctx) => {
  try {
    const { code, avatar_url, gender, nick_name, birthday, phone } =
      ctx.request.body;
    const { openid, session_key, unionid } = await getOpenId(code);

    await db("users").insert({
      avatar_url,
      gender,
      nick_name,
      birthday: Date.parse(birthday) / 1000,
      openid,
      session_key,
      register_time: Date.now() / 1000,
      status: "待审核",
      role: "陪玩",
      phone,
      unionid,
    });
    //发送消息给所有超级管理员
    //发送消息模板通知
    // 获取access_token
    const accessToken = await getAccessToken();
    //获取所有超级管理员的wechat_openid
    const wxopenid = (
      await db("users").where({ role: "超级管理员" }).select("wechat_openid")
    ).map((item) => item.wechat_openid);
    // 发送模板消息
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;

    const templateId = "IVazyFw9xiHVLhGyYO2wzlmbjYBmCYNErWyLyZ3d9Ng"; // 你创建的模板ID
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    //循环所有的wxopenid
    for (let i = 0; i < wxopenid.length; i++) {
      const data = {
        touser: wxopenid[i],
        template_id: templateId,
        // url: 'http://weixin.qq.com/download',
        data: {
          thing2: {
            value: "FT报备",
            color: "#173177",
          },
          thing1: {
            value: nick_name,
            color: "#173177",
          },
          time3: {
            value: formattedDate,
            color: "#173177",
          },
        },
      };
      await axios.post(url, data);
    }
    ctx.send(201, "申请注册成功");
  } catch (e) {
    ctx.send(203, e);
  }
});
// 验证用户是否通过审核，如果已经通过，返回 token
router.post("/login", async (ctx) => {
  console.log("call for login");
  const { code } = ctx.request.body;
  const { openid } = await getOpenId(code);
  const user = await db("users").where({ openid }).first();
  if (!user) {
    ctx.send(200, null, { status: "未注册" });
  } else {
    const {
      id,
      nick_name,
      avatar_url,
      gender,
      status,
      role,
      birthday,
      register_time,
    } = user;
    ctx.send(200, null, {
      status,
      token: jwt.sign({ id, role }, jwtSecretKey),
      info: { nick_name, avatar_url, gender, birthday, register_time },
    });
  }
});

// 用户上传头像
router.post("/upload.avatar", async (ctx) => {
  try {
    const res = await postObject("user-avatar", ctx.request.files);
    if (!res) {
      ctx.status = 400;
    } else {
      ctx.status = 200;
      ctx.body = `/wechat-report/user-avatar/${res}`;
    }
  } catch (e) {
    ctx.status = 400;
    ctx.body = e.message;
  }
});
// 获取所有用户列表
router.post("/user.list.get", async (ctx) => {
  const { queryString } = ctx.request.body;
  const data = await db("users")
    .where({ status: "正常" })
    .where(
      (builder) =>
        queryString && builder.where("nick_name", "like", `%${queryString}%`)
    )
    .select("id", "nick_name");
  ctx.send(200, "", data);
});

// 获取用户信息（自己）
router.post("/user.info.get", tokenVerify(clubMember), async (ctx) => {
  try {
    const { id } = ctx.state;
    const data = await db("users").where({ id }).first();
    ctx.send(200, "", data);
  } catch (e) {
    ctx.send(400, e.message);
  }
});

router.post("/recharge.list.get", tokenVerify(clubMember), async (ctx) => {
  try {
    const { id } = ctx.state;
    //时间转换成年月日 把 接收人的 id 换成名字
    const data = await db("transactions")
      .leftJoin("users as u", "u.id", "transactions.recipient_id")
      .leftJoin("users as v", "v.id", "transactions.operator_id")
      .select(
        "transactions.id",
        "transactions.balance",
        "transactions.recharge_amount",
        "transactions.transaction_time",
        "u.nick_name as recipient_name",
        "v.nick_name as operator_name"
      )
      .where("transactions.operator_id", id)
      .orderBy("transactions.transaction_time", "desc")

      .then((data) => {
        //操作人换成自己的名字
        data.forEach((item) => {
          item.transaction_time = new Date(
            item.transaction_time * 1000
          ).toLocaleString();
        });
        return data;
      });
    ctx.send(200, "", data);
  } catch (e) {
    ctx.send(400, e.message);
  }
});

//充值
router.post("/recharge", tokenVerify(clubMember), async (ctx) => {
  try {
    const { amount } = ctx.request.body;
    const amountNum = Number(amount);
    const { id } = ctx.state;
    const balance = await db("users").where({ id }).first("points");
    await db("transactions").insert({
      operator_id: id,
      recipient_id: id,
      balance: balance.points + amountNum,
      recharge_amount: amountNum,
      transaction_time: Date.now() / 1000,
      transaction_type: "自行充值",
    });
    await db("users")
      .where({ id })
      .update({ points: balance.points + amountNum });

    //发送充值成功通知
    // 获取access_token
    const accessToken = await getAccessToken();
    //获取所有超级管理员的wechat_openid
    const wxopenid = (await db("users").where({ id }).first("wechat_openid"))
      .wechat_openid;
    // 发送模板消息
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;

    const templateId = "SvU-9wQ3uZtk8rjfFcqyRbe7wZaLxlz1vCTot-iakzM"; // 你创建的模板ID
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    const now_money = Number(balance.points + amountNum);
    const data = {
      touser: wxopenid,
      template_id: templateId,
      miniprogram: {
        appid: "wx232fe1b0a8b67d43",
      },
      data: {
        thing4: {
          value: "FT报备",
          color: "#173177",
        },
        amount2: {
          value: now_money,
          color: "#173177",
        },
        time3: {
          value: formattedDate,
          color: "#173177",
        },
        amount1: {
          value: amountNum,
          color: "#173177",
        },
      },
    };
    const result = await axios.post(url, data);
    ctx.send(200, result.data);
  } catch (e) {
    ctx.send(400, e.message);
  }
});

//给好友充值
router.post("/recharge.friend", tokenVerify(clubMember), async (ctx) => {
  const { amount, recipient_id } = ctx.request.body;
  const amountNum = Number(amount);
  const { id } = ctx.state;
  try {
    const balance = await db("users")
      .where({ id: recipient_id })
      .first("points");
    await db("transactions").insert({
      operator_id: id,
      recipient_id,
      balance: balance.points + amountNum,
      recharge_amount: amountNum,
      transaction_time: Date.now() / 1000,
      transaction_type: "好友充值",
    });
    await db("users")
      .where({ id: recipient_id })
      .update({ points: balance.points + amountNum });
  } catch (e) {
    ctx.send(400, e.message);
  }
  ctx.send(200, "充值成功");
});

//管理员调整积分
router.post("/recharge.adjust", tokenVerify(clubMember), async (ctx) => {
  try {
    const { amount, recipient_id } = ctx.request.body;
    const amountNum = Number(amount);
    const { id } = ctx.state;

    const balance = await db("users")
      .where({ id: recipient_id })
      .first("points");
    await db("transactions").insert({
      operator_id: id,
      recipient_id,
      balance: balance.points + amountNum,
      recharge_amount: amountNum,
      transaction_time: Date.now() / 1000,
      transaction_type: "管理员调整",
    });
    await db("users")
      .where({ id: recipient_id })
      .update({ points: balance.points + amountNum });
    ctx.send(200, "充值成功");
  } catch (e) {
    ctx.send(400, e.message);
  }
});
// member.getNew 获取所有状态为待审核 的成员
router.post("/member.getNew", tokenVerify(clubMember), async (ctx) => {
  const data = await db("users")
    .where({ status: "待审核" })
    .select(
      "id",
      "nick_name",
      "avatar_url",
      "gender",
      "birthday",
      "register_time"
    );
  ctx.send(200, "", data);
});

//user.approve
router.post("/user.approve", tokenVerify(clubMember), async (ctx) => {
  const { id } = ctx.request.body;
  await db("users").where({ id }).update({ status: "正常" });
  ctx.send(200, "审核成功");
});

//user.reject
router.post("/user.reject", tokenVerify(clubMember), async (ctx) => {
  const { id } = ctx.request.body;
  await db("users").where({ id }).update({ status: "禁用" });
  ctx.send(200, "审核成功");
});

//获取所有用户 将时间转换成年月日
router.post("/user.list.get.all", tokenVerify(clubMember), async (ctx) => {
  const data = await db("users").select("*");
  data.forEach((item) => {
    item.register_time = new Date(item.register_time * 1000).toLocaleString();
  });
  ctx.send(200, "", data);
});

//上传收款二维码 存储到minio存储同 返回地址
router.post("/user.pay.qrcode.upload", async (ctx) => {
  try {
    const res = await postObject("user-pay-qrcode", ctx.request.files);
    if (!res) {
      ctx.status = 400;
    } else {
      ctx.status = 200;
      ctx.body = `/wechat-report/user-pay-qrcode/${res}`;
    }
  } catch (e) {
    ctx.send(400, e.message);
  }
});

//领工资
router.post("/user.pay.get", tokenVerify(clubMember), async (ctx) => {
  // {"phone":"李成","name":"18506149598","amount":"10000","fee":"60","actual_amount":"9940"}
  try {
    const { phone, name, amount, fee, actual_amount, qrcode_url } =
      ctx.request.body;
    await db("users")
      .where({ id: ctx.state.id })
      .update({
        points: db.raw("points - ?", [actual_amount]),
      });
    // salary_records
    await db("salary_records").insert({
      user_id: ctx.state.id,
      qrcode_url: qrcode_url.toString(),
      phone,
      name,
      amount,
      fee,
      actual_amount,
    });
    ctx.send(200, "领工资成功");
  } catch (e) {
    ctx.send(400, e.message);
  }
});
///user.pay.get.list
router.post("/user.pay.get.list", tokenVerify(clubMember), async (ctx) => {
  const data = await db("salary_records")
    .where({ user_id: ctx.state.id })
    .select("*");
  ctx.send(200, "", data);
});

//计算可提现 退款中 处理中 已提现
router.post("/user.pay.get.balance", tokenVerify(clubMember), async (ctx) => {
  const data = await db("salary_records")
    .where({ user_id: ctx.state.id })
    .select("*");
  let balance = 0;
  let refund = 0;
  let processing = 0;
  let withdraw = 0;
  data.forEach((item) => {
    switch (item.status) {
      case "未领取":
        processing += item.actual_amount;
        break;
      case "已领取":
        withdraw += item.actual_amount;
        break;
    }
  });
  // 查看个人积分
  balance = (await db("users").where({ id: ctx.state.id }).first("points"))
    .points;
  ctx.send(200, "", { balance, refund, processing, withdraw });
});

//获取当前用户剩余积分
router.post("/user.points.get", tokenVerify(clubMember), async (ctx) => {
  const balance = (
    await db("users").where({ id: ctx.state.id }).first("points")
  ).points;
  ctx.send(200, "", balance);
});

//消耗积分
router.post("/user.points.consume", tokenVerify(clubMember), async (ctx) => {
  const { amount } = ctx.request.body;
  const amountNum = Number(amount);
  const balance = (
    await db("users").where({ id: ctx.state.id }).first("points")
  ).points;
  if (balance < amountNum) {
    ctx.send(400, "积分不足");
  } else {
    await db("users").where({ id: ctx.state.id });
  }
});

//查看当前用户是否绑定微信公众号
router.post("/isBind", tokenVerify(clubMember), async (ctx) => {
  try {
    const id = ctx.state.id;
    ctx.send(
      200,
      "success",
      await db("users").where({ id }).first("wechat_openid")
    );
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
});

//绑定用户和公众号
router.get("/bind", async (ctx) => {
  try {
    const { id, code } = ctx.query;
    //通过code 换取 https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx1179af9b80246159&secret=4500e96f9d12e63a49d711a8dc5e5d3b&code=${code}&grant_type=authorization_code`;
    const userinfo = await axios.get(url);
    // ctx.send(200, JSON.stringify(url));
    // ctx.send(200, JSON.stringify(userinfo.data));
    await db("users")
      .where({ id })
      .update({ wechat_openid: userinfo.data.openid });
    ctx.send(200, userinfo.data.openid);
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
});

//查找用户id
router.post("/find", tokenVerify(clubMember), async (ctx) => {
  try {
    ctx.send(200, "success", ctx.state.id);
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
});

//查看会员的消费记录 根据时间范围 消费日期 项目 单价 数量 接单人 总价
router.post("/user.consume.list", async (ctx) => {
  try {
    // 获取请求体中的参数
    const { id, startTime, endTime } = ctx.request.body;

    // 基础查询
    let query = db("reports")
      .leftJoin("users", "reports.user_id", "users.id")
      .leftJoin("items", "reports.item_id", "items.id")
      .leftJoin("gifts", "reports.item_id", "gifts.id")
      .select(
        "reports.id",
        "reports.create_time",
        "items.name as item_name",
        "gifts.name as gift_name",
        "reports.unit_price",
        "reports.order_count",
        "users.nick_name as user_name",
        "reports.total"
      )
      .where("reports.vip_id", id);

    // 根据是否提供了时间范围来添加条件
    if (startTime && endTime) {
      // 将 startTime 和 endTime 转换为 UNIX 时间戳
      const start = Math.floor(new Date(startTime).getTime() / 1000);
      const end = Math.floor(new Date(endTime).getTime() / 1000);
      query = query.whereBetween("reports.create_time", [start, end]);
    }

    // 执行查询
    const data = await query.orderBy("reports.create_time", "desc");

    // 处理查询结果
    data.forEach((item) => {
      item.create_time = new Date(item.create_time * 1000).toLocaleString(); // 转换时间格式
      item.project_name = item.item_name || item.gift_name; // 选择项目名称
    });

    // 返回结果
    ctx.send(200, "", data);
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
});

module.exports = router;
