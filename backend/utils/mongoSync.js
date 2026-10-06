const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://karankit505_db_user:MqvuaCzOYgrvei6R@cluster0.wzwpuel.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0';

const syncToMongo = async (collectionName, rawDocument) => {
  try {
    if (!process.env.MONGO_URI && !mongoUri) return;

    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    }

    if (mongoose.connection.db) {
      const document = rawDocument && typeof rawDocument.toJSON === 'function' ? rawDocument.toJSON() : { ...rawDocument };
      const docToInsert = { ...document, updatedAt: new Date() };
      if (!docToInsert.createdAt) {
        docToInsert.createdAt = new Date();
      }

      if (docToInsert.id && !docToInsert.mysql_id) {
        docToInsert.mysql_id = docToInsert.id;
      }

      // Build unique filter query based on collection type
      let queryFilter = null;
      if (collectionName === 'users') {
        if (document.email) {
          queryFilter = { email: document.email };
        } else if (document.phone) {
          queryFilter = { phone: document.phone };
        } else if (docToInsert.mysql_id) {
          queryFilter = { mysql_id: docToInsert.mysql_id };
        }
      } else if (collectionName === 'payments') {
        if (document.transaction_id) {
          queryFilter = { transaction_id: document.transaction_id };
        } else if (docToInsert.mysql_id) {
          queryFilter = { mysql_id: docToInsert.mysql_id };
        }
      } else if (collectionName === 'memberships') {
        if (docToInsert.mysql_id) {
          queryFilter = { mysql_id: docToInsert.mysql_id };
        }
      } else {
        if (document.email) {
          queryFilter = { email: document.email };
        } else if (document.transaction_id) {
          queryFilter = { transaction_id: document.transaction_id };
        } else if (docToInsert.mysql_id) {
          queryFilter = { mysql_id: docToInsert.mysql_id };
        }
      }

      if (queryFilter) {
        await mongoose.connection.db.collection(collectionName).updateOne(
          queryFilter,
          { $set: docToInsert },
          { upsert: true }
        );
      } else {
        await mongoose.connection.db.collection(collectionName).insertOne(docToInsert);
      }

      console.log(`[MongoDB Sync Success] Document synced/upserted in collection "${collectionName}" (ID: ${document.email || document.transaction_id || docToInsert.mysql_id || document.id || 'doc'})`);
    }
  } catch (err) {
    console.error(`[MongoDB Sync Error] Failed to sync to "${collectionName}":`, err.message);
  }
};

module.exports = { syncToMongo };

