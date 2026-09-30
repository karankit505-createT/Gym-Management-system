const bcrypt = require('bcryptjs');
const { sequelize, connectDB } = require('../config/db');
const { User, Plan, Staff, Membership, Payment, Announcement, Attendance } = require('../models');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();
    console.log('[Seed] Synchronizing database tables...');
    await sequelize.sync({ force: true });
    console.log('[Seed] Database tables synchronized successfully.');

    // 1. Create Default Admin
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Gym Administrator',
      email: 'admin@ironpulse.com',
      phone: '+919998887770',
      password_hash: adminPasswordHash,
      gender: 'male',
      role: 'admin',
      is_verified: true
    });
    console.log('[Seed] Admin account created: admin@ironpulse.com / admin123');

    // 2. Create Default Membership Plans
    const plans = await Plan.bulkCreate([
      {
        name: 'Monthly Starter',
        duration_days: 30,
        price: 999.00,
        description: 'Access to gym equipment, locker room, and free trainer orientation.',
        is_active: true
      },
      {
        name: 'Quarterly Pro',
        duration_days: 90,
        price: 2499.00,
        description: 'Full access + group fitness classes + 1 complimentary personal training session.',
        is_active: true
      },
      {
        name: 'Half-Yearly Elite',
        duration_days: 180,
        price: 4499.00,
        description: 'Full access + steam room & sauna + 5 personal training sessions + diet plan.',
        is_active: true
      },
      {
        name: 'Yearly VIP Champion',
        duration_days: 365,
        price: 7999.00,
        description: 'Unlimited 24/7 access + all facilities + unlimited trainer consultation + free apparel kit.',
        is_active: true
      }
    ]);
    console.log('[Seed] Created 4 membership plans.');

    // 3. Create Default Staff Accounts
    const staffPasswordHash = await bcrypt.hash('staff123', 10);
    
    const staffUser1 = await User.create({
      name: 'Alex Rivera (Staff)',
      email: 'staff@ironpulse.com',
      phone: '+919998887771',
      password_hash: staffPasswordHash,
      gender: 'male',
      role: 'staff',
      is_verified: true
    });

    await Staff.create({
      user_id: staffUser1.id,
      designation: 'Senior Fitness Instructor',
      permissions: 'attendance,members_view',
      added_by_admin_id: admin.id
    });

    const staffUser2 = await User.create({
      name: 'Priya Sharma (Trainer)',
      email: 'trainer@ironpulse.com',
      phone: '+919998887779',
      password_hash: staffPasswordHash,
      gender: 'female',
      role: 'staff',
      is_verified: true
    });

    await Staff.create({
      user_id: staffUser2.id,
      designation: 'HIIT & Conditioning Specialist',
      permissions: 'attendance,members_view',
      added_by_admin_id: admin.id
    });
    console.log('[Seed] Staff accounts created: staff@ironpulse.com & trainer@ironpulse.com / staff123');

    // 4. Create Demo Members

    // Helper date generator
    const now = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    // Member 1: John Doe (Active Quarterly Pro)
    const memberPasswordHash = await bcrypt.hash('member123', 10);
    const member1 = await User.create({
      name: 'John Doe',
      email: 'member@ironpulse.com',
      phone: '+919998887772',
      password_hash: memberPasswordHash,
      gender: 'male',
      address: '456 Muscle Avenue, Workout City',
      role: 'user',
      is_verified: true
    });

    const startDate1 = new Date(now);
    startDate1.setDate(now.getDate() - 15);
    const endDate1 = new Date(startDate1);
    endDate1.setDate(startDate1.getDate() + 90);

    const m1 = await Membership.create({
      user_id: member1.id,
      plan_id: plans[1].id, // Quarterly Pro
      start_date: formatDate(startDate1),
      end_date: formatDate(endDate1),
      status: 'active'
    });

    await Payment.create({
      user_id: member1.id,
      membership_id: m1.id,
      plan_id: plans[1].id,
      amount: plans[1].price,
      transaction_id: `pay_demo_john_${Date.now()}`,
      payment_status: 'success',
      payment_method: 'razorpay'
    });

    // Member 2: Rahul Sharma (Active Yearly VIP Champion)
    const member2 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@ironpulse.com',
      phone: '+919998887773',
      password_hash: memberPasswordHash,
      gender: 'male',
      address: '789 Power Street, Fitness Hub',
      role: 'user',
      is_verified: true
    });

    const startDate2 = new Date(now);
    startDate2.setDate(now.getDate() - 45);
    const endDate2 = new Date(startDate2);
    endDate2.setDate(startDate2.getDate() + 365);

    const m2 = await Membership.create({
      user_id: member2.id,
      plan_id: plans[3].id, // Yearly VIP
      start_date: formatDate(startDate2),
      end_date: formatDate(endDate2),
      status: 'active'
    });

    await Payment.create({
      user_id: member2.id,
      membership_id: m2.id,
      plan_id: plans[3].id,
      amount: plans[3].price,
      transaction_id: `pay_demo_rahul_${Date.now()}`,
      payment_status: 'success',
      payment_method: 'razorpay'
    });

    // Member 3: Pooja Deshmukh (Active Half-Yearly Elite)
    const member3 = await User.create({
      name: 'Pooja Deshmukh',
      email: 'pooja@ironpulse.com',
      phone: '+919998887774',
      password_hash: memberPasswordHash,
      gender: 'female',
      address: '12 Health Boulevard, Iron Town',
      role: 'user',
      is_verified: true
    });

    const startDate3 = new Date(now);
    startDate3.setDate(now.getDate() - 10);
    const endDate3 = new Date(startDate3);
    endDate3.setDate(startDate3.getDate() + 180);

    const m3 = await Membership.create({
      user_id: member3.id,
      plan_id: plans[2].id, // Half-Yearly
      start_date: formatDate(startDate3),
      end_date: formatDate(endDate3),
      status: 'active'
    });

    await Payment.create({
      user_id: member3.id,
      membership_id: m3.id,
      plan_id: plans[2].id,
      amount: plans[2].price,
      transaction_id: `pay_demo_pooja_${Date.now()}`,
      payment_status: 'success',
      payment_method: 'razorpay'
    });

    // Member 4: Vikram Singh (Expired Monthly Starter)
    const member4 = await User.create({
      name: 'Vikram Singh',
      email: 'vikram@ironpulse.com',
      phone: '+919998887775',
      password_hash: memberPasswordHash,
      gender: 'male',
      address: '33 Stamina Road, Gym Village',
      role: 'user',
      is_verified: true
    });

    const startDate4 = new Date(now);
    startDate4.setDate(now.getDate() - 45);
    const endDate4 = new Date(startDate4);
    endDate4.setDate(startDate4.getDate() + 30);

    const m4 = await Membership.create({
      user_id: member4.id,
      plan_id: plans[0].id, // Monthly
      start_date: formatDate(startDate4),
      end_date: formatDate(endDate4),
      status: 'expired'
    });

    await Payment.create({
      user_id: member4.id,
      membership_id: m4.id,
      plan_id: plans[0].id,
      amount: plans[0].price,
      transaction_id: `pay_demo_vikram_${Date.now()}`,
      payment_status: 'success',
      payment_method: 'cash'
    });

    // Member 5: Ananya Verma (New User without active plan)
    await User.create({
      name: 'Ananya Verma',
      email: 'ananya@ironpulse.com',
      phone: '+919998887776',
      password_hash: memberPasswordHash,
      gender: 'female',
      address: '99 Cardio Lane, Sport City',
      role: 'user',
      is_verified: true
    });

    console.log('[Seed] Created 5 demo members (Active, Expired, New).');

    // 5. Create Attendance Records for Today
    const todayStr = formatDate(now);
    
    await Attendance.create({
      user_id: member1.id,
      date: todayStr,
      check_in: '07:30:00',
      check_out: '09:00:00'
    });

    await Attendance.create({
      user_id: member2.id,
      date: todayStr,
      check_in: '08:15:00',
      check_out: null
    });

    await Attendance.create({
      user_id: member3.id,
      date: todayStr,
      check_in: '09:00:00',
      check_out: null
    });

    console.log('[Seed] Created today\'s attendance check-ins.');

    // 6. Create Announcements
    await Announcement.create({
      title: '🏋️ Welcome to IronPulse Gym Management!',
      message: 'New cardio machines and heavy-duty squat racks have been added to floor 2. Book your free trainer session today!',
      created_by: admin.id
    });

    await Announcement.create({
      title: '⚡ Weekend Group HIIT & Yoga Workshop',
      message: 'Join us this Saturday at 8:00 AM in the Aerobics Studio for an intense full-body group workout led by Priya Sharma.',
      created_by: admin.id
    });

    await Announcement.create({
      title: '🔔 Lockers Maintenance Notice',
      message: 'Locker maintenance will be performed on Sunday from 2:00 PM to 4:00 PM. Please clear temporary belongings.',
      created_by: admin.id
    });
    console.log('[Seed] Announcements created.');

    console.log('==================================================');
    console.log('🎉 Seeding completed successfully!');
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
