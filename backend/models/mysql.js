import 'dotenv/config'
import mysql from'mysql2/promise';

//Criando a conexão usando as credenciais do banco relacional
const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'CalangoAceso',
    database: 'sirion_relacional',
    waitForConnections: true,
    connectionLimit: 10
});

console.log('conexão com o MySQL estabelecida.');

export {mysqlPool};