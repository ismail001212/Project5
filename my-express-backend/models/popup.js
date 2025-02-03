const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
  chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  element_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  word_or_phrase: { type: String, required: true },
  popup_content: { type: String, required: true }
});

const Popup = mongoose.model('Popup', popupSchema);

module.exports = Popup;