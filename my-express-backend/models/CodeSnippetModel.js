const mongoose = require('mongoose');

const CodeSnippetSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
  chapterId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chapter' },
  language: { type: String, required: true },
  index: { type: Number, required: true },
  code: { type: String, required: true }, // Multiline strings are supported
  codeResults: { type: String, required: true }, // Multiline strings are supported
  syntaxLanguage: { type: String, required: true }, // E.g., 'javascript', 'python'
});

module.exports = mongoose.model( 'CodeSnippet' , CodeSnippetSchema);
