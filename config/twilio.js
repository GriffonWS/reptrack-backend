import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number (with country code, e.g., +1234567890)
 * @param {string} message - SMS message content
 * @returns {Promise<object>} Twilio message response
 */
export const sendSMS = async (to, message) => {
  try {
    console.log(`📱 Sending SMS to ${to}...`);

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    console.log(`✅ SMS sent successfully! SID: ${result.sid}`);
    return {
      success: true,
      messageSid: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('❌ Twilio SMS error:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Send OTP SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} otp - OTP code
 * @returns {Promise<object>}
 */
export const sendOTP = async (phoneNumber, otp) => {
  const message = `Your RepTrack verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nDo not share this code with anyone.`;
  return await sendSMS(phoneNumber, message);
};

export default twilioClient;
