const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://karankit505_db_user:MqvuaCzOYgrvei6R@cluster0.wzwpuel.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0';

async function migrateMysqlToMongo() {
  let mysqlConn;
  try {
    console.log('==================================================');
    console.log('🚀 Starting Data Migration: MySQL -> MongoDB Atlas');
    console.log('==================================================');

    // 1. Connect to Local MySQL
    console.log('[1/4] Connecting to Local XAMPP MySQL (gym_management)...');
    mysqlConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gym_management'
    });
    console.log('✅ Connected to MySQL.');

    // 2. Connect to MongoDB Atlas
    console.log('[2/4] Connecting to MongoDB Atlas Cluster...');
    const mongoConn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    const db = mongoConn.connection.db;
    console.log(`✅ Connected to MongoDB Atlas DB: "${db.databaseName}"`);

    // 3. List of Tables to Migrate
    const tables = [
      'users',
      'plans',
      'memberships',
      'payments',
      'staff',
      'attendance',
      'announcements',
      'contact_inquiries',
      'otp_verifications'
    ];

    console.log('[3/4] Migrating Tables & Data to MongoDB Collections...');

    for (const tableName of tables) {
      try {
        // Fetch rows from MySQL
        const [rows] = await mysqlConn.query(`SELECT * FROM \`${tableName}\`;`);
        console.log(`\n📦 Table "${tableName}": Found ${rows.length} rows in MySQL.`);

        if (rows.length > 0) {
          const collection = db.collection(tableName);

          // Clear existing collection to avoid duplicates
          await collection.deleteMany({});

          // Transform date strings or objects if needed and insert
          const mongoDocs = rows.map(row => {
            const doc = { ...row };
            // Preserve original MySQL integer ID as mysql_id
            if (row.id) {
              doc.mysql_id = row.id;
            }
            return doc;
          });

          const result = await collection.insertMany(mongoDocs);
          console.log(`   └─ 🚀 Successfully migrated ${result.insertedCount} documents into MongoDB collection "${tableName}"!`);
        } else {
          console.log(`   └─ ℹ️ Collection "${tableName}" is empty in MySQL. Skipping insert.`);
        }
      } catch (tableErr) {
        console.warn(`   └─ ⚠️ Table "${tableName}" warning: ${tableErr.message}`);
      }
    }

    console.log('\n==================================================');
    console.log('🎉 Migration Completed Successfully!');
    console.log('==================================================');

    await mysqlConn.end();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Migration Failed Error:', err.message);
    if (mysqlConn) await mysqlConn.end();
    process.exit(1);
  }
}

migrateMysqlToMongo();
