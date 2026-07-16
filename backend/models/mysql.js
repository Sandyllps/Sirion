import 'dotenv/config'
import mysql from'mysql2/promise';

//Criando a conexão usando as credenciais do banco relacional
const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

console.log('conexão com o MySQL estabelecida.');

export {mysqlPool};