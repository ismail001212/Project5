const Title = require('../models/TitleModel'); // Adjust the path to your Title model
const Subtitle = require('../models/SubtitleModel'); // Adjust the path to your Subtitle model
const Description = require('../models/DescriptionModel'); // Adjust the path to your Description model
const Image = require('../models/ImageModel'); // Adjust the path to your Image model
const ListModel = require('../models/ListModel');
const NoteModel = require('../models/NoteModel');
const CodeSnippetModel = require('../models/CodeSnippetModel');
const TitleModel = require('../models/TitleModel');
const SubtitleModel = require('../models/SubtitleModel');
const DescriptionModel = require('../models/DescriptionModel');
const ImageModel = require('../models/ImageModel');

/**
 * Update indexes of content items.
 * @param {Array} items - Array of items with _id, type, and index properties.
 * @returns {Promise} - Resolves when all updates are complete.
 */

const updateIndexes = async (req, res) => {
    const { items } = req.body;
  
    try {
      const updatePromises = items.map((item) => {
        switch (item.type) {
          case 'title':
            return Title.findByIdAndUpdate(item._id, { index: item.index });
          case 'subtitle':
            return Subtitle.findByIdAndUpdate(item._id, { index: item.index });
          case 'description':
            return Description.findByIdAndUpdate(item._id, { index: item.index });
          case 'image':
            return Image.findByIdAndUpdate(item._id, { index: item.index });
          case 'codeSnippet':
            return CodeSnippetModel.findByIdAndUpdate(item._id, { index: item.index });
          case 'note':
            return NoteModel.findByIdAndUpdate(item._id, { index: item.index });
          case 'list':
            return ListModel.findByIdAndUpdate(item._id, { index: item.index });
          default:
            return Promise.resolve();
        }
      });
  
      await Promise.all(updatePromises);
  
      res.status(200).json({ message: 'Indexes updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating indexes', error });
    }
  };

const deleteContent = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
  
    try {
      switch (type) {
        case 'title':
          await Title.findByIdAndDelete(id);
          break;
        case 'subtitle':
          await Subtitle.findByIdAndDelete(id);
          break;
        case 'description':
          await Description.findByIdAndDelete(id);
          break;
        case 'image':
          await Image.findByIdAndDelete(id);
          break;
        case 'codeSnippet':
          await CodeSnippet.findByIdAndDelete(id);
          break;
        case 'note':
          await Note.findByIdAndDelete(id);
          break;
        case 'list':
          await List.findByIdAndDelete(id);
          break;
        default:
          return res.status(400).json({ message: 'Invalid content type' });
      }
  
      res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting content', error });
    }
  };
  const getLastIndex = async (req, res) => {
    const { chapterId } = req.params;
  
    try {
      const titles = await TitleModel.find({ chapterId }).sort({ index: -1 }).limit(1);
      const subtitles = await SubtitleModel.find({ chapterId }).sort({ index: -1 }).limit(1);
      const descriptions = await DescriptionModel.find({ chapterId }).sort({ index: -1 }).limit(1);
      const images = await ImageModel.find({ chapterId }).sort({ index: -1 }).limit(1);
      const codeSnippets = await CodeSnippetModel.find({ chapterId }).sort({ index: -1 }).limit(1);
      const notes = await NoteModel.find({ chapterId }).sort({ index: -1 }).limit(1);
      const lists = await ListModel.find({ chapterId }).sort({ index: -1 }).limit(1);
  
      const lastIndexes = [
        ...titles,
        ...subtitles,
        ...descriptions,
        ...images,
        ...codeSnippets,
        ...notes,
        ...lists,
      ].map(item => item.index);
  
      const lastIndex = Math.max(0, ...lastIndexes);
  
      res.status(200).json({ lastIndex });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching last index', error });
    }
  };
  
  

module.exports = { updateIndexes, deleteContent ,getLastIndex };
