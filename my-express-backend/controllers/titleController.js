const Title = require('../models/TitleModel');

exports.addTitle = async (req, res) => {
  const { courseId, chapterId, language, index, title } = req.body;
  try {
    const newTitle = new Title({ courseId, chapterId, language, index, title });
    await newTitle.save();
    res.status(201).json(newTitle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTitlesByChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const titles = await Title.find({ chapterId });
    res.status(200).json(titles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTitle = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedTitle = await Title.findByIdAndUpdate(id, { title }, { new: true });
    res.status(200).json(updatedTitle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTitle = async (req, res) => {
  const { id } = req.params;
  try {
    await Title.findByIdAndDelete(id);
    res.status(200).json({ message: 'Title deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
