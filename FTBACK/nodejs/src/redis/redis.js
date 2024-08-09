const redis = require('./server');

// redis 获取
const get =  async (key) => {
    try{
        // 连接redis
        await redis.connect()
        // 获取数据
        const data = await redis.get(key);
        // 断开连接
        await redis.quit()
        // 返回数据
        return data
    }catch (e) {
        return e
    }
}

// redis 设置
const set = async (key, value) => {
    try{
        // 连接redis
        await redis.connect()
        // 设置数据
        await redis.set(key, value).then(r=>console.log(r)).catch(e=>console.log(e));
        // 断开连接
        await redis.quit()
        // 返回成功
        return true
    }catch (e) {
        return e
    }
}

module.exports = {
    get,
    set
}
