import axios from 'axios';

console.log('✅ Base URL:', process.env.REACT_APP_API_URL); // 🔍 Check if this logs correctly

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default API;
