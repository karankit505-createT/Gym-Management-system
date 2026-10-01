const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://karankit505_db_user:MqvuaCzOYgrvei6R@cluster0.wzwpuel.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0';

const syncToMongo = async (collectionName, document) => {
  try {
    if (!process.env.MONGO_URI && !mongoUri) return;

    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    }

    if (mongoose.connection.db) {
      const docToInsert = { ...document, updatedAt: new Date() };
      if (!docToInsert.createdAt) {
        docToInsert.createdAt = new Date();
      }
      await mongoose.connection.db.collection(collectionName).insertOne(docToInsert);
      console.log(`[MongoDB Sync Success] Document synced to collection "${collectionName}" (ID: ${document.email || document.id || 'doc'})`);
    }
  } catch (err) {
    console.error(`[MongoDB Sync Error] Failed to sync to "${collectionName}":`, err.message);
  }
};

module.exports = { syncToMongo };
