const Image = require('../models/ImageModel');

exports.addImage = async (req, res) => {
  const { courseId, chapterId, language, index, src, alt } = req.body;

  try {
    const newImage = new Image({
      courseId,
      chapterId,
      language,
      index,
      src,
      alt,
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getImagesByChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const images = await Image.find({ chapterId });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateImage = async (req, res) => {
  const { id } = req.params;
  const { src, alt } = req.body;

  try {
    const updatedImage = await Image.findByIdAndUpdate(id, { src, alt }, { new: true });
    if (!updatedImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findByIdAndDelete(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
