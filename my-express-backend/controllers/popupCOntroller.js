const Popup = require('../models/popup');
const Title = require('../models/TitleModel');
const Subtitle = require('../models/SubtitleModel');
const Description = require('../models/DescriptionModel');
const Image = require('../models/ImageModel');
const CodeSnippet = require('../models/CodeSnippetModel');
const Note = require('../models/NoteModel');
const List = require('../models/ListModel');

exports.getElementContent = async (req, res) => {
    const { elementId } = req.params;
  
    try {
      let element = await Title.findById(elementId) ||
                    await Subtitle.findById(elementId) ||
                    await Description.findById(elementId) ||
                    await Image.findById(elementId) ||
                    await CodeSnippet.findById(elementId) ||
                    await Note.findById(elementId) ||
                    await List.findById(elementId);
  
      if (!element) {
        return res.status(404).json({ message: 'Element not found' });
      }
  
      const type = element.constructor.modelName.toLowerCase();
      res.status(200).json({ type, content: element.content || element });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching element content', error });
    }
  };
// Function to fetch pop-ups for a given element
exports.getPopups = async (req, res) => {
  const { elementId } = req.params;

  try {
    const popups = await Popup.find({ element_id: elementId });
    res.status(200).json(popups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pop-ups', error });
  }
};
//fetche poup by id


// Function to create a new pop-up
exports.createPopup = async (req, res) => {
  const { chapter_id, element_id, word_or_phrase, popup_content } = req.body;

  try {
    const newPopup = new Popup({
      chapter_id,
      element_id,
      word_or_phrase,
      popup_content,
    });

    const savedPopup = await newPopup.save();
    res.status(201).json(savedPopup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating pop-up', error });
  }
};
