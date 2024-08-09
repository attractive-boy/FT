const {verify} = require("jsonwebtoken");
const {jwtSecretKey} = require('./config.default.js')

exports.ctxMiddle = (ctx, next) => {
    ctx.send = (code, msg, data) => {
        ctx.status = code
        ctx.body = {
            msg,
            data,
        }
    }
    ctx.file = (file) => {
        ctx.body = file
    }
    return next()
}

exports.tokenVerify = (auth) => {
    return async (ctx, next) => {
        const {authorization} = ctx.request.header;
        if (!authorization) {
            ctx.send(401, "请先登录");
            return;
        }

        const token = authorization.replace("Bearer ", "");
        try {
            const {role, id} = verify(token, jwtSecretKey);
            ctx.state.id = id;
            if(!id || id.length < 1 ){
                ctx.send(401, "请先登录");
                return;
            }else{
                // ctx.send(200, ctx.state.id);
                // return;
            }

            if (auth) {
                if (!auth.includes(role)) {
                    ctx.send(403);
                    return;
                }
            }
        } catch (err) {
            const errorMessages = {
                'TokenExpiredError': 'Token已过期',
                'JsonWebTokenError': '无效的Token'
            };
            ctx.send(401, errorMessages[err.name] || '未知错误');
        }
        await next();
    };
};

exports.getUserId = async (ctx, next) => {
    const {authorization} = ctx.request.header;
    if (!authorization) {
        ctx.send(401, "请先登录");
        return;
    }

    const token = authorization.replace("Bearer ", "");

    try {
        const {id} = verify(token, jwtSecretKey);
        ctx.state.id = id;
        await next();
    } catch (err) {
        const errorMessages = {
            'TokenExpiredError': 'Token已过期',
            'JsonWebTokenError': '无效的Token'
        };
        ctx.send(401, errorMessages[err.name] || '未知错误');
    }
}