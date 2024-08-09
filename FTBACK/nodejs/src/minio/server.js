const Minio = require('minio')
const uuid = require('uuid-random');
const fs = require('node:fs');
const {MINIO_HOST} = require('../config.default.js')


const minioClient = new Minio.Client({
    endPoint: MINIO_HOST,
    port: 9000,
    useSSL: false,
    accessKey: 'admin123',
    secretKey: 'admin123'
})
const postObject = async (type, files) => {
    const uid = uuid() + '.' + files.file.originalFilename.split('.').pop();
    const readStream = fs.createReadStream(files.file.filepath);
    try {
        await minioClient.putObject('wechat-report', `${type}/${uid}`, readStream);
        return uid;
    } catch (err) {
        console.log(err);
        return false;
        
    } finally {
        readStream.close();
    }
};



module.exports = {
    postObject,
    minioClient
}