const mongoose = require('mongoose');
const { User } = require('./models');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

const phoneTarget = '+919998887772';

const removeUser = async () => {
  try {
    await connectDB();
    await sequelize.sync();

    const user = await User.findOne({ where: { phone: phoneTarget } });
    if (user) {
      console.log(`[Local DB] Found user ${user.name} (${user.email}, ID: ${user.id}). Deleting...`);
      await user.destroy();
      console.log(`[Local DB] Successfully deleted user from local DB.`);
    } else {
      console.log(`[Local DB] No user found with phone ${phoneTarget}`);
    }

    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://karankit505_db_user:MqvuaCzOYgrvei6R@cluster0.wzwpuel.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });

    const result = await mongoose.connection.db.collection('users').deleteMany({
      $or: [{ phone: phoneTarget }, { phone: '9998887772' }]
    });

    console.log(`[MongoDB Atlas] Deleted ${result.deletedCount} document(s) matching phone ${phoneTarget}.`);
    process.exit(0);
  } catch (err) {
    console.error('Error removing user:', err);
    process.exit(1);
  }
};

removeUser();
