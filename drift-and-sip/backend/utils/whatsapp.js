import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const instanceId = process.env.ULTRA_INSTANCE_ID;
    const token = process.env.ULTRA_TOKEN;

    const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;

    const payload = {
      to,
      body: message,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    await axios.post(url, payload, {
      headers,
      params: { token },
    });

    console.log('✅ WhatsApp message sent');
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message:', error.response?.data || error.message);
  }
};
