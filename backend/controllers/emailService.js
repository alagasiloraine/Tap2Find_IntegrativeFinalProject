import nodemailer from "nodemailer";
import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "perjescykean35@gmail.com",
    pass: "tvuo wqip iyxs jens",
  },
});

// Email template function
const getEmailTemplate = (title, message, type) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'inquiry': return '#3B82F6';
      case 'announcement': return '#10B981';
      case 'reminder': return '#F59E0B';
      case 'alert': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'inquiry': return 'New Inquiry';
      case 'announcement': return 'Announcement';
      case 'reminder': return 'Reminder';
      case 'alert': return 'Alert';
      default: return 'Notification';
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: ${getTypeColor(type)}; padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; color: #374151; }
        .message { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        .type-badge { display: inline-block; padding: 4px 12px; background-color: ${getTypeColor(type)}; color: white; border-radius: 20px; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Tap2Find</h1>
          <p>Campus Management System</p>
        </div>
        <div class="content">
          <div class="type-badge">${getTypeText(type)}</div>
          <h2>${title}</h2>
          <div class="message">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p><small>This is an automated notification from Tap2Find System.</small></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Tap2Find. All rights reserved.</p>
          <p>Please do not reply to this automated email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Get verified users based on criteria
const getVerifiedUsers = async (criteria = {}) => {
  try {
    const db = getDB();
    const users = db.collection("users");
    
    const query = { 
      isVerified: true,
      ...criteria 
    };

    const verifiedUsers = await users.find(query).toArray();
    return verifiedUsers;
  } catch (error) {
    console.error("❌ Error fetching verified users:", error);
    throw error;
  }
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: '"Tap2Find System" <perjescykean35@gmail.com>',
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${to}`);
    return result;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    throw error;
  }
};

// Send notification emails based on notification type
export const sendNotificationEmails = async (notificationData) => {
  try {
    const { title, message, type, studentId, professorId, isGeneral = false, targetRole = null } = notificationData;

    let recipients = [];
    let emailSubject = `Tap2Find Notification: ${title}`;

    // Determine recipients based on notification type
    if (isGeneral) {
      // Send to all verified users
      recipients = await getVerifiedUsers();
      console.log(`📧 Sending general notification to ${recipients.length} verified users`);
    } else if (targetRole) {
      // Send to all verified users of specific role
      recipients = await getVerifiedUsers({ role: targetRole });
      console.log(`📧 Sending ${targetRole} notification to ${recipients.length} verified ${targetRole}s`);
    } else if (studentId) {
      // Send to specific student
      recipients = await getVerifiedUsers({ _id: new ObjectId(studentId), role: 'student' });
      console.log(`📧 Sending notification to specific student: ${studentId}`);
    } else if (professorId) {
      // Send to specific professor
      recipients = await getVerifiedUsers({ _id: new ObjectId(professorId), role: 'professor' });
      console.log(`📧 Sending notification to specific professor: ${professorId}`);
    }

    if (recipients.length === 0) {
      console.log('⚠️ No verified recipients found for notification');
      return { success: false, message: 'No verified recipients found' };
    }

    // Send emails to all recipients
    const emailPromises = recipients.map(recipient => {
      const emailHtml = getEmailTemplate(title, message, type);
      return sendEmail(recipient.emailAddress, emailSubject, emailHtml);
    });

    await Promise.all(emailPromises);
    console.log(`✅ Successfully sent ${emailPromises.length} notification emails`);

    return { success: true, sentCount: emailPromises.length };
  } catch (error) {
    console.error("❌ Error sending notification emails:", error);
    throw error;
  }
};

// Specific email functions for common scenarios
export const sendInquiryEmailToProfessor = async (inquiryData, professorId) => {
  const { title, message, studentName } = inquiryData;
  
  const emailTitle = `New Inquiry: ${title}`;
  const emailMessage = `
    You have received a new inquiry from ${studentName}:
    
    ${message}
    
    Please log in to the Tap2Find system to respond to this inquiry.
  `;

  return await sendNotificationEmails({
    title: emailTitle,
    message: emailMessage,
    type: 'inquiry',
    professorId: professorId
  });
};

export const sendInquiryResolvedEmailToStudent = async (inquiryData, studentId) => {
  const { title, professorName } = inquiryData;
  
  const emailTitle = `Inquiry Resolved: ${title}`;
  const emailMessage = `
    Your inquiry "${title}" has been marked as resolved by Professor ${professorName}.
    
    If you have any further questions, please don't hesitate to reach out.
    
    Thank you for using Tap2Find!
  `;

  return await sendNotificationEmails({
    title: emailTitle,
    message: emailMessage,
    type: 'inquiry',
    studentId: studentId
  });
};

export const sendGeneralAnnouncement = async (title, message) => {
  return await sendNotificationEmails({
    title: title,
    message: message,
    type: 'announcement',
    isGeneral: true
  });
};

export const sendRoleSpecificNotification = async (title, message, targetRole) => {
  return await sendNotificationEmails({
    title: title,
    message: message,
    type: 'announcement',
    targetRole: targetRole
  });
};

export default transporter;