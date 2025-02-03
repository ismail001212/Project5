const Subtitle = require('../models/SubtitleModel');

exports.addSubtitle = async (req, res) => {
  const { courseId, chapterId, language, index, subtitle } = req.body;
  try {
    const newSubtitle = new Subtitle({ courseId, chapterId, language, index, subtitle });
    await newSubtitle.save();
    res.status(201).json(newSubtitle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubtitlesByChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const subtitles = await Subtitle.find({ chapterId });
    res.status(200).json(subtitles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubtitle = async (req, res) => {
  const { id } = req.params;
  const { subtitle } = req.body;
  try {
    const updatedSubtitle = await Subtitle.findByIdAndUpdate(id, { subtitle }, { new: true });
    res.status(200).json(updatedSubtitle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubtitle = async (req, res) => {
  const { id } = req.params;
  try {
    await Subtitle.findByIdAndDelete(id);
    res.status(200).json({ message: 'Subtitle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

