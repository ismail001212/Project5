const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
  chapterId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chapter' },
  language: { type: String, required: true },
  index: { type: Number, required: true },
  note: { type: String, required: true },
});

module.exports = mongoose.model('Note', NoteSchema);
