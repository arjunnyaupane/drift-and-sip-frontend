// Optional schema if we later want to expand to DB-based admin accounts
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
