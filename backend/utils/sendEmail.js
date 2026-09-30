const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_USER !== 'test@ethereal.email') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback to test ethereal account or console logger
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    return null;
  }
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await createTransporter();
    const from = process.env.EMAIL_FROM || '"IronPulse Gym" <noreply@ironpulse.com>';
    
    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text: text || html.replace(/<[^>]+>/g, ''),
        html
      });
      console.log(`[Email Sent] To: ${to} | Subject: "${subject}" | Message ID: ${info.messageId}`);
      if (nodemailer.getTestMessageUrl(info)) {
        console.log(`[Email Preview URL]: ${nodemailer.getTestMessageUrl(info)}`);
      }
      return true;
    } else {
      console.log(`[Email Log - Fallback Mode] To: ${to} | Subject: "${subject}"`);
      console.log(`[Email Body]:\n${text || html}`);
      return true;
    }
  } catch (error) {
    console.error('[Email Sending Error]:', error.message);
    // Don't crash app if email fails
    return false;
  }
};

module.exports = sendEmail;
