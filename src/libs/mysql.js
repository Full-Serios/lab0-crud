import mysql from 'serverless-mysql'

export const dbConnection = mysql({
  library: require('mysql2'),
  config: {
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    port: process.env.MYSQL_ADDON_PORT,
    database: process.env.MYSQL_ADDON_DB
  }
})
