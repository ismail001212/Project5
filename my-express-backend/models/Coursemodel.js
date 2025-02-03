const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    
  courseimage: {
    type: String, // Path to the uploaded image
    required: true,
  },
  language: {
    type: String, // Path to the uploaded image
    required: true,
  },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

module.exports = mongoose.model('Course', courseSchema);
