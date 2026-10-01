const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Op } = require('sequelize');
const { User, OtpVerification } = require('../models');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_gym_jwt_key_2026_xyz';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// 1. Register User (Instant activation without OTP modal)
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, gender, dob, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const photo = req.file ? req.file.filename : null;

    const newUser = await User.create({
      name,
      email,
      phone,
      password_hash,
      gender: gender || 'male',
      dob: dob || null,
      address: address || null,
      photo,
      role: 'user',
      is_verified: true // Direct activation
    });

    // Dual Sync to MongoDB Atlas (if connected)
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      mongoose.connection.db.collection('users').insertOne({
        mysql_id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        gender: newUser.gender,
        address: newUser.address,
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then(r => console.log(`[MongoDB Sync Success] User "${newUser.email}" synced to MongoDB Atlas collection "users".`))
        .catch(err => console.error('[MongoDB Sync Error]:', err.message));
    }

    // Send Welcome email (non-blocking)
    sendEmail({
      to: newUser.email,
      subject: 'Welcome to IronPulse Gym!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #1a1a2e; color: #ffffff; padding: 25px; border-radius: 10px;">
          <h2 style="color: #ff4500;">Welcome to IronPulse Gym, ${newUser.name}!</h2>
          <p>Your member account has been created successfully. Explore our plans and start your fitness journey today!</p>
        </div>
      `,
      text: `Welcome to IronPulse Gym, ${newUser.name}!`
    }).catch(err => console.error('[Background Welcome Email Error]:', err.message));

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to IronPulse Gym.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        is_verified: true,
        photo: newUser.photo,
        gender: newUser.gender,
        address: newUser.address
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Verify OTP (Retained for backwards compatibility / password resets)
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp_code } = req.body;

    if (!email || !otp_code) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const otpRecord = await OtpVerification.findOne({
      where: {
        email,
        otp_code,
        expires_at: { [Op.gt]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.is_verified = true;
    await user.save();

    await OtpVerification.destroy({ where: { email } });

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Account verified successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_verified: user.is_verified,
        photo: user.photo
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Login User / Staff / Admin
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log(`[Auth Login Attempt]: identifier="${identifier}"`);

    if (!identifier || !password) {
      console.warn('[Auth Login Failed]: Missing identifier or password');
      return res.status(400).json({ success: false, message: 'Please provide email/phone and password' });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }]
      }
    });

    if (!user) {
      console.warn(`[Auth Login Failed]: User not found for identifier "${identifier}"`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.warn(`[Auth Login Failed]: Password mismatch for user "${user.email}"`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    console.log(`[Auth Login Success]: User "${user.email}" (role: ${user.role}) logged in successfully.`);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo,
        gender: user.gender,
        address: user.address
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user account found with that email' });
    }

    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000);

    await OtpVerification.create({
      user_id: user.id,
      email: user.email,
      otp_code,
      purpose: 'reset-password',
      expires_at
    });

    await sendEmail({
      to: user.email,
      subject: 'IronPulse Gym - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #1a1a2e; color: #ffffff; padding: 20px; border-radius: 8px;">
          <h3 style="color: #ff4500;">Password Reset Request</h3>
          <p>Hi ${user.name}, use the OTP code below to reset your password:</p>
          <h2 style="color: #ff4500;">${otp_code}</h2>
          <p>Valid for 10 minutes.</p>
        </div>
      `,
      text: `Password reset OTP: ${otp_code}`
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email',
      otpDebug: process.env.NODE_ENV === 'development' ? otp_code : undefined
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp_code, newPassword } = req.body;
    if (!email || !otp_code || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const otpRecord = await OtpVerification.findOne({
      where: {
        email,
        otp_code,
        purpose: 'reset-password',
        expires_at: { [Op.gt]: new Date() }
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    await user.save();

    await OtpVerification.destroy({ where: { email } });

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
