const CodeSnippet = require('../models/CodeSnippetModel');

exports.addCodeSnippet = async (req, res) => {
  const { courseId, chapterId, language, index, code, syntaxLanguage, codeResults } = req.body;
  try {
    const newCodeSnippet = new CodeSnippet({ courseId, chapterId, language, index, code, syntaxLanguage, codeResults });
    await newCodeSnippet.save();
    res.status(201).json(newCodeSnippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCodeSnippetsByChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const snippets = await CodeSnippet.find({ chapterId });
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCodeSnippet = async (req, res) => {
  const { id } = req.params;
  const { code, syntaxLanguage, codeResults } = req.body;

  try {
    const updatedSnippet = await CodeSnippet.findByIdAndUpdate(
      id,
      { code, syntaxLanguage, codeResults }, 
      { new: true } // Return the updated document
    );

    // Check if the CodeSnippet was found and updated
    if (!updatedSnippet) {
      return res.status(404).json({ message: 'CodeSnippet not found' });
    }

    res.status(200).json(updatedSnippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteCodeSnippet = async (req, res) => {
  const { id } = req.params;
  try {
    await CodeSnippet.findByIdAndDelete(id);
    res.status(200).json({ message: 'Code snippet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
