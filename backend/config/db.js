const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'gym_management';
const dbDialect = process.env.DB_DIALECT || 'mysql';

let sequelize;

if (dbDialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../gym_management.sqlite'),
    logging: false
  });
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
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
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    await sequelize.authenticate();
    console.log(`[Database] Connected successfully to MySQL database "${dbName}".`);
  } catch (err) {
    console.warn(`[Database] MySQL Connection Notice (${err.message}). Switching to SQLite fallback.`);
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../gym_management.sqlite'),
      logging: false
    });
    await sequelize.authenticate();
    console.log('[Database] Connected successfully via SQLite fallback.');
  }
};

module.exports = { sequelize, connectDB };
