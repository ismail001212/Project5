const Chapter = require('../models/ChapterModel');
const Course = require('../models/Coursemodel');

// 📚 1. Create a New Chapter
exports.createChapter = async (req, res) => {
  const { course } = req.body;
  
  try {
    // 1. Search for the course by its _id
    const foundCourse = await Course.findById(course);

    // If the course is not found, return an error
    if (!foundCourse) {
      return res.status(404).json({
        error: 'Course not found. Please provide a valid course ID.',
      });
    }

    // 2. If course exists, create the new chapter without checking for duplicate indexes
    const chapter = new Chapter(req.body);
    await chapter.save();
    res.status(201).json(chapter);

  } catch (error) {
    // Handle other errors
    res.status(400).json({ error: error.message });
  }
};

// 📚 2. Get All Chapters
exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().populate('course');
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 3. Get a Chapter by ID
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('course');
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 4. Update a Chapter
exports.updateChapter = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Step 1: Directly update the chapter without checking for duplicate indexes
    const chapter = await Chapter.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validators are applied
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.status(200).json(chapter);

  } catch (error) {
    // Handle unexpected errors
    res.status(400).json({ error: error.message });
  }
};

// 📚 5. Delete a Chapter by ID
exports.deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.status(200).json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 6. Get Chapters by Course ID
exports.getChaptersByCourse = async (req, res) => {
  const { courseId } = req.params;  // We expect `courseId` in the route params

  try {
    // 1. Search for the course by its _id
    const foundCourse = await Course.findById(courseId);

    // If the course is not found, return an error
    if (!foundCourse) {
      return res.status(404).json({
        error: 'Course not found. Please provide a valid course ID.',
      });
    }

    // 2. Get all chaptqers that belong to this course, no index checks
    const chapters = await Chapter.find({ course: courseId }).sort('index');
    
    // Return the chapters
    res.status(200).json(chapters);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📚 7. Reorder Chapters
exports.reorderChapters = async (req, res) => {
  try {
    const { order } = req.body; // Expecting [{ id: 'chapterId', index: 1 }, ...]
    
    // Step 1: Perform the updates directly without any checks or temporary index changes
    const updatePromises = order.map(({ id, index }) =>
      Chapter.findByIdAndUpdate(id, { index }, { runValidators: true })
    );
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    res.status(200).json({ message: 'Chapters reordered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📚 8. Search Chapters by Title or Description
exports.searchChapters = async (req, res) => {
  try {
    const { query } = req.query;
    const chapters = await Chapter.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
