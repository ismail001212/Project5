const mongoose = require('mongoose');

const SubtitleSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
  chapterId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chapter' },
  language: { type: String, required: true },
  index: { type: Number, required: true },
  subtitle: { type: String, required: true },
});

module.exports = mongoose.model('Subtitle', SubtitleSchema);
