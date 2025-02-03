const mongoose = require('mongoose');

const DescriptionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
  chapterId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chapter' },
  language: { type: String, required: true },
  index: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Description', DescriptionSchema);
