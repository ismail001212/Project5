const Description = require('../models/DescriptionModel');

exports.addDescription = async (req, res) => {
  const { courseId, chapterId, language, index, description } = req.body;
  try {
    const newDescription = new Description({ courseId, chapterId, language, index, description });
    await newDescription.save();
    res.status(201).json(newDescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDescriptionsByChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const descriptions = await Description.find({ chapterId });
    res.status(200).json(descriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDescription = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const updatedDescription = await Description.findByIdAndUpdate(id, { description }, { new: true });
    res.status(200).json(updatedDescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDescription = async (req, res) => {
  const { id } = req.params;
  try {
    await Description.findByIdAndDelete(id);
    res.status(200).json({ message: 'Description deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
