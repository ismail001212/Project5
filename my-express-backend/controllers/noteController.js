const Note = require('../models/NoteModel');

exports.addNote = async (req, res) => {
  const { courseId, chapterId, language, index, note } = req.body;
  try {
    const newNote = new Note({ courseId, chapterId, language, index, note });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotesByChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const notes = await Note.find({ chapterId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, { note }, { new: true });
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
