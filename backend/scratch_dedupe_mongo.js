const mongoose = require('mongoose');
require('dotenv').config();

const deduplicateMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://karankit505_db_user:MqvuaCzOYgrvei6R@cluster0.wzwpuel.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('[MongoDB Atlas] Connected to database.');

    const db = mongoose.connection.db;
    const collections = ['users', 'leads', 'contact_inquiries'];

    for (const collName of collections) {
      console.log(`\n--- Deduplicating Collection: "${collName}" ---`);
      const collection = db.collection(collName);
      const docs = await collection.find({}).toArray();

      const grouped = {};
      for (const doc of docs) {
        // Unique key: lowercase email or phone or trimmed name
        const key = (doc.email || doc.phone || doc.name || '').toString().toLowerCase().trim();
        if (!key) continue;

        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(doc);
      }

      let removedCount = 0;
      for (const key of Object.keys(grouped)) {
        const list = grouped[key];
        if (list.length > 1) {
          // Sort by createdAt / updatedAt DESC so index 0 is the newest document
          list.sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return timeB - timeA;
          });

          // Keep list[0], remove list[1..n]
          const toDeleteIds = list.slice(1).map(d => d._id);
          const delRes = await collection.deleteMany({ _id: { $in: toDeleteIds } });
          removedCount += delRes.deletedCount;
          console.log(`[Dedupe] Key "${key}": Kept 1 document, deleted ${delRes.deletedCount} duplicate(s).`);
        }
      }

      console.log(`[Summary] Collection "${collName}": Total duplicates removed = ${removedCount}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Deduplication Error:', err);
    process.exit(1);
  }
};

deduplicateMongo();
