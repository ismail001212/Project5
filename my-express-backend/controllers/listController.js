const List = require('../models/ListModel');

exports.addListItem = async (req, res) => {
  const { courseId, chapterId, language, index, item } = req.body;
  try {
    const newItem = new List({ courseId, chapterId, language, index, item });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListByChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const listItems = await List.find({ chapterId }).sort({ index: 1 }); // Sort items by their order
    res.status(200).json(listItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateListItem = async (req, res) => {
  const { id } = req.params;
  const { item } = req.body;
  try {
    const updatedItem = await List.findByIdAndUpdate(id, { item}, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteListItem = async (req, res) => {
  const { id } = req.params;
  try {
    await List.findByIdAndDelete(id);
    res.status(200).json({ message: 'List item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
