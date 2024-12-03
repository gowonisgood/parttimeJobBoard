const mysql = require('mysql2');
const env = process.env.NODE_ENV || 'development';
const config = require(process.cwd() + '/config/config.json')[env];

const pool = mysql.createPool({
    host: 'localhost',
    //port: 3306,
    user: 'root',
    password: 'root',
    database: 'alba_platform', //데이터베이스_이름
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
}).promise();

module.exports = pool;