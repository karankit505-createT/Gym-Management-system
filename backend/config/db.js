const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'gym_management';
const isProduction = process.env.NODE_ENV === 'production';

// Determine dialect cleanly before instantiating Sequelize:
// If DB_DIALECT is 'sqlite', OR if in production without a remote DB_HOST, default to sqlite.
let dbDialect = process.env.DB_DIALECT;
if (!dbDialect || dbDialect === 'sqlite' || (!dbHost && isProduction) || (dbHost === 'localhost' && isProduction)) {
  dbDialect = 'sqlite';
}

let sequelize;

if (dbDialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../gym_management.sqlite'),
    logging: false
  });
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost || 'localhost',
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

const connectDB = async () => {
  if (dbDialect === 'sqlite') {
    await sequelize.authenticate();
    console.log('[Database] Connected successfully via SQLite.');
    return;
  }

  try {
    // First, ensure MySQL database exists
    const connection = await mysql.createConnection({
      host: dbHost || 'localhost',
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    await sequelize.authenticate();
    console.log(`[Database] Connected successfully to MySQL database "${dbName}".`);
  } catch (err) {
    console.error(`[Database] MySQL Connection Error (${err.message}).`);
    throw err;
  }
};

module.exports = { sequelize, connectDB };
