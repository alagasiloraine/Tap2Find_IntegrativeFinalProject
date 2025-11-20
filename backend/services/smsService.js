// smsService.js
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const FIREBASE_URL = process.env.FIREBASE_URL;

/**
 * Send SMS via Firebase
 * @param {string} number - Phone number
 * @param {string} message - SMS message
 * @returns {Promise<Object>} Response object
 */
export const sendSMS = async (number, message) => {
  try {
    if (!FIREBASE_URL) {
      throw new Error("FIREBASE_URL is not configured");
    }

    if (!number || !message) {
      throw new Error("Number and message are required");
    }

    const payload = {
      number: number,
      message: message,
      sent: false,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(FIREBASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    console.log(`✅ SMS queued for ${number}: ${message.substring(0, 50)}...`);

    return {
      success: true,
      status: "queued",
      firebase_key: responseData.name,
      timestamp: payload.timestamp
    };

  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    throw error;
  }
};

/**
 * Send SMS with retry logic
 * @param {string} number - Phone number
 * @param {string} message - SMS message
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Object>} Response object
 */
export const sendSMSWithRetry = async (number, message, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📱 Attempt ${attempt} to send SMS to ${number}`);
      const result = await sendSMS(number, message);
      return result;
    } catch (error) {
      console.error(`❌ SMS attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to send SMS after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};