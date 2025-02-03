const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  language: { type: String, required: true },
  index: { type: Number, required: true }, // Order of the list item in the list
  item: { type: String, required: true }, // Content of the list item
});

module.exports = mongoose.model('List', listSchema);
