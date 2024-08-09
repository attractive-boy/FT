const {WechatPay} = require("wechat-pay-nodejs");
const {resolve} = require("node:path");
const {readFileSync} = require("node:fs");
const {format} = require('date-fns')
const {db} = require("../db");

const certPrivateKey = readFileSync(resolve(__dirname, 'apiclient_key.pem'));
const certPublicCert = readFileSync(resolve(__dirname, 'apiclient_cert.pem'));

const wechatPay = new WechatPay({
    appid: 'wx232fe1b0a8b67d43', // 应用ID
    mchid: '1677748243', // 直连商户号
    cert_private_content: Buffer.from(certPrivateKey), // 商户API私钥内容
    cert_public_content: Buffer.from(certPublicCert), // 商户API证书内容
})

const jsapi = async (ctx, total, desc = '测试') => {
    const user_id = ctx.state.id;
    const user = await db('users').where({id: user_id}).select('openid').first()
    return await wechatPay.prepayJsapi({
        description: desc,
        out_trade_no: 'FT' + format(Date.now(), 'yyyyMMdd-HHmmss') + `*${user_id}`,
        notify_url: 'https://ftbclub.top',
        amount: {
            total, // 订单总金额，单位为分
        },
        payer: {
            openid: user.openid

        }
    })
}

module.exports = {
    jsapi
}