const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Email templates
const emailTemplates = {
  welcome: {
    subject: 'ยินดีต้อนรับสู่ FitConnect!',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #232956;">ยินดีต้อนรับสู่ FitConnect!</h2>
        <p>สวัสดี ${data.name},</p>
        <p>ขอบคุณที่เข้าร่วม FitConnect แพลตฟอร์มค้นหาเทรนเนอร์ออกกำลังกายที่ดีที่สุด</p>
        <p>คุณสามารถเริ่มต้นการใช้งานได้เลยที่ <a href="${process.env.FRONTEND_URL}">FitConnect</a></p>
        <p>หากมีคำถามใดๆ สามารถติดต่อเราได้ที่ support@fitconnect.com</p>
        <p>ขอบคุณ,<br>ทีม FitConnect</p>
      </div>
    `
  },
  
  sessionReminder: {
    subject: 'แจ้งเตือนเซสชั่นการออกกำลังกาย',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #232956;">แจ้งเตือนเซสชั่นการออกกำลังกาย</h2>
        <p>สวัสดี ${data.clientName},</p>
        <p>เซสชั่นการออกกำลังกายของคุณจะเริ่มใน 1 ชั่วโมง</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>เทรนเนอร์:</strong> ${data.trainerName}</p>
          <p><strong>วันที่:</strong> ${data.sessionDate}</p>
          <p><strong>เวลา:</strong> ${data.sessionTime}</p>
          <p><strong>สถานที่:</strong> ${data.location}</p>
        </div>
        <p>หากต้องการเลื่อนหรือยกเลิกนัดหมาย กรุณาแจ้งล่วงหน้าอย่างน้อย 2 ชั่วโมง</p>
        <p>ขอให้สนุกกับการออกกำลังกาย!</p>
        <p>ทีม FitConnect</p>
      </div>
    `
  },
  
  sessionCancelled: {
    subject: 'แจ้งยกเลิกเซสชั่นการออกกำลังกาย',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #df2528;">แจ้งยกเลิกเซสชั่นการออกกำลังกาย</h2>
        <p>สวัสดี ${data.recipientName},</p>
        <p>เซสชั่นการออกกำลังกายต่อไปนี้ได้ถูกยกเลิกแล้ว</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>เทรนเนอร์:</strong> ${data.trainerName}</p>
          <p><strong>ลูกค้า:</strong> ${data.clientName}</p>
          <p><strong>วันที่:</strong> ${data.sessionDate}</p>
          <p><strong>เวลา:</strong> ${data.sessionTime}</p>
          <p><strong>เหตุผล:</strong> ${data.reason}</p>
        </div>
        <p>หากต้องการนัดหมายใหม่ กรุณาติดต่อผ่านแอปพลิเคชัน</p>
        <p>ทีม FitConnect</p>
      </div>
    `
  },
  
  trainerApproved: {
    subject: 'ยืนยันการเป็นเทรนเนอร์เรียบร้อยแล้ว',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">ยืนยันการเป็นเทรนเนอร์เรียบร้อยแล้ว!</h2>
        <p>สวัสดี ${data.name},</p>
        <p>ยินดีด้วย! บัญชีเทรนเนอร์ของคุณได้รับการยืนยันแล้ว</p>
        <p>ตอนนี้คุณสามารถ:</p>
        <ul>
          <li>สร้างแพคเกจการออกกำลังกาย</li>
          <li>รับลูกค้าใหม่</li>
          <li>จัดตารางการเทรน</li>
          <li>เริ่มต้นรับรายได้</li>
        </ul>
        <p>เริ่มต้นใช้งานได้เลยที่ <a href="${process.env.FRONTEND_URL}/trainer/dashboard">Dashboard</a></p>
        <p>ขอบคุณที่เป็นส่วนหนึ่งของ FitConnect</p>
        <p>ทีม FitConnect</p>
      </div>
    `
  },
  
  passwordReset: {
    subject: 'รีเซ็ตรหัสผ่าน FitConnect',
    html: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #232956;">รีเซ็ตรหัสผ่าน</h2>
        <p>สวัสดี ${data.name},</p>
        <p>เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ</p>
        <p>กรุณาคลิกปุ่มด้านล่างเพื่อรีเซ็ตรหัสผ่าน:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background: #232956; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            รีเซ็ตรหัสผ่าน
          </a>
        </div>
        <p>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
        <p>หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลนี้</p>
        <p>ทีม FitConnect</p>
      </div>
    `
  }
};

/**
 * Send email
 * @param {object} options - Email options
 * @returns {Promise} Send result
 */
const sendEmail = async (options) => {
  try {
    const { to, subject, html, text, attachments = [] } = options;
    
    const mailOptions = {
      from: `"FitConnect" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
      attachments
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId
    };
    
  } catch (error) {
    console.error('Send email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send template email
 * @param {string} templateName - Template name
 * @param {string} to - Recipient email
 * @param {object} data - Template data
 * @returns {Promise} Send result
 */
const sendTemplateEmail = async (templateName, to, data) => {
  try {
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    
    const options = {
      to,
      subject: template.subject,
      html: template.html(data)
    };
    
    return await sendEmail(options);
    
  } catch (error) {
    console.error('Send template email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send welcome email
 * @param {string} email - User email
 * @param {string} name - User name
 * @returns {Promise} Send result
 */
const sendWelcomeEmail = async (email, name) => {
  return await sendTemplateEmail('welcome', email, { name });
};

/**
 * Send session reminder
 * @param {object} sessionData - Session data
 * @returns {Promise} Send result
 */
const sendSessionReminder = async (sessionData) => {
  return await sendTemplateEmail('sessionReminder', sessionData.clientEmail, sessionData);
};

/**
 * Send session cancellation notification
 * @param {object} sessionData - Session data
 * @returns {Promise} Send result
 */
const sendSessionCancellation = async (sessionData) => {
  // Send to both trainer and client
  const results = await Promise.all([
    sendTemplateEmail('sessionCancelled', sessionData.trainerEmail, {
      ...sessionData,
      recipientName: sessionData.trainerName
    }),
    sendTemplateEmail('sessionCancelled', sessionData.clientEmail, {
      ...sessionData,
      recipientName: sessionData.clientName
    })
  ]);
  
  return results;
};

/**
 * Send trainer approval notification
 * @param {string} email - Trainer email
 * @param {string} name - Trainer name
 * @returns {Promise} Send result
 */
const sendTrainerApproval = async (email, name) => {
  return await sendTemplateEmail('trainerApproved', email, { name });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} resetUrl - Reset URL
 * @returns {Promise} Send result
 */
const sendPasswordReset = async (email, name, resetUrl) => {
  return await sendTemplateEmail('passwordReset', email, { name, resetUrl });
};

/**
 * Test email configuration
 * @returns {Promise} Test result
 */
const testEmailConfig = async () => {
  try {
    const result = await transporter.verify();
    return {
      success: true,
      message: 'Email configuration is valid'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendEmail,
  sendTemplateEmail,
  sendWelcomeEmail,
  sendSessionReminder,
  sendSessionCancellation,
  sendTrainerApproval,
  sendPasswordReset,
  testEmailConfig
};