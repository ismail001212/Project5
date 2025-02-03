const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces from title
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a Course model
    ref: 'Course',
    required: true, // Ensure every chapter is tied to a course
  },
  index: {
    type: Number,
    required: true,
    min: 0,
  },
  language: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🗓️ Virtual Property for Formatted Date
ChapterSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString();
});

// 🧹 Remove __v Field in JSON Responses
ChapterSchema.methods.toJSON = function () {
  const chapter = this.toObject();
  delete chapter.__v;
  return chapter;
};

const Chapter = mongoose.model('Chapter', ChapterSchema);

module.exports = Chapter;
