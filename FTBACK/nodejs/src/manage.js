const Koa = require('koa')
const cors = require('koa2-cors');
const {koaBody} = require('koa-body')
const {APP_PORT} = require('./config.default.js')
const Router = require('koa-router'); // 导入 koa-router
const userRouter = require('./api/users')
const manageRouter = require('./api/manage')
const {ctxMiddle} = require('./middlewares')
require('./wechat/index')


const app = new Koa()
const router = new Router(); // 创建一个新的 Router 实例


app.use(ctxMiddle)
    .use(koaBody({
        multipart: true
    }))
    .use(cors())
    .use(userRouter.routes())
    .use(manageRouter.routes())

app.listen(APP_PORT, () => {
    console.log(`server is running on http://localhost:${APP_PORT}`)
})

