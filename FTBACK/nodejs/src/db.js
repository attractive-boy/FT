const {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE} = require('./config.default.js')
const knex = require('knex')
const db = knex({
    client: 'mysql',
    connection: {
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE
    }
})

module.exports = {db}