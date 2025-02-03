const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  status: { type: String, required: true, default: "waiting" },
  expiration_date: { type: Date, required: true, 
    default: () => {
      const now = new Date();
      now.setMonth(now.getMonth() + 6); // Add 6 months to the current date
      return now;
    } 
  },  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerifiedAt: { type: Date, default: null }, // Field for email verification
  Actif: { type: Boolean, default: false ,required:true }, // Field for email verification
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
