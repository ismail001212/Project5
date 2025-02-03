const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  language: { type: String, required: true },
  index: { type: Number, required: true },
  src: { type: String, required: true },
  alt: { type: String, required: true },
});

module.exports = mongoose.model('Image', imageSchema);
