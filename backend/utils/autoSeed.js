const bcrypt = require('bcryptjs');
const { User, Plan, Staff, Membership, Payment, Announcement, Attendance } = require('../models');

const autoSeed = async () => {
  try {
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('[AutoSeed] Database already contains data. Skipping auto-seed.');
      return;
    }

    console.log('[AutoSeed] Empty database detected. Seeding demo accounts and initial data...');

    // 1. Create Admin
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

    // 2. Create Membership Plans
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

    // 3. Create Staff Accounts
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

    // 4. Create Demo Members
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

    const now = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    const startDate1 = new Date(now);
    startDate1.setDate(now.getDate() - 15);
    const endDate1 = new Date(startDate1);
    endDate1.setDate(startDate1.getDate() + 90);

    const m1 = await Membership.create({
      user_id: member1.id,
      plan_id: plans[1].id,
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

    // Member 2
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
      plan_id: plans[3].id,
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

    // 5. Announcements
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

    console.log('[AutoSeed] Initial demo data seeded successfully!');
  } catch (error) {
    console.error('[AutoSeed Error]:', error);
  }
};

module.exports = { autoSeed };
