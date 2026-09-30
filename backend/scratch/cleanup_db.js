const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanup() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL server.');

    // Check databases
    const [databases] = await connection.query('SHOW DATABASES;');
    console.log('Databases found:', databases.map(d => Object.values(d)[0]));

    // Check if old unneeded database 'gym_db' exists
    const hasGymDb = databases.some(d => Object.values(d)[0] === 'gym_db');
    if (hasGymDb) {
      console.log('Dropping unneeded old database: gym_db ...');
      await connection.query('DROP DATABASE IF EXISTS `gym_db`;');
      console.log('Successfully dropped old database `gym_db`!');
    } else {
      console.log('No unneeded `gym_db` database found.');
    }

    // Inspect active database 'gym_management'
    const [tables] = await connection.query('SHOW TABLES FROM `gym_management`;');
    console.log('Active tables in `gym_management`:', tables.map(t => Object.values(t)[0]));

    await connection.end();
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
}

cleanup();
