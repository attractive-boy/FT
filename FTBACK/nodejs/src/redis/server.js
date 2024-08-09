const redis = require('redis');

// 创建一个Redis客户端实例
const client = redis.createClient();

module.exports = client;
