const express = require('express');
const User = require('../models/userModel');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const multer = require('multer'); // For handling file uploads
const authMiddleware = require('../middleware/authMiddleware');
const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  updateUserByEmail,
  AcceptedUser,
  WaitingUser,
  RejectedUser,
  logoutUser
} = require('../controllers/authController');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  upload
} = require('../controllers/categoryController');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByCategory} = require('../controllers/courseController');
const uploadimagecourse = require('../middleware/upload');
const userModel = require('../models/userModel');
const {  reorderChapters, getChaptersByCourse, deleteChapter, updateChapter, getChapterById, getAllChapters, createChapter } = require('../controllers/chapterController');
const { addTitle, getTitlesByChapter, updateTitle, deleteTitle } = require('../controllers/titleController');
const { addSubtitle, getSubtitlesByChapter, updateSubtitle, deleteSubtitle } = require('../controllers/subtitleController');
const { addDescription, getDescriptionsByChapter, updateDescription, deleteDescription } = require('../controllers/descriptionController');
const { addImage, getImagesByChapter, updateImage, deleteImage } = require('../controllers/imageController');
const { addCodeSnippet, getCodeSnippetsByChapter, deleteCodeSnippet, updateCodeSnippet } = require('../controllers/codeSnippetController');
const { addNote, getNotesByChapter, updateNote, deleteNote } = require('../controllers/noteController');
const { addListItem, getListByChapter, updateListItem, deleteListItem } = require('../controllers/listController');
const { updateIndexes, deleteContent, getLastIndex } = require('../controllers/updateindexes');
const { getPopupsByChapter, createPopup, updatePopup, deletePopup, getPopups, getElementContent } = require('../controllers/popupCOntroller');
const Popup = require('../models/popup');
const router = express.Router();


// Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// User Management Routes (protected with authMiddleware)
router.get('/user/accepted', authMiddleware, AcceptedUser); // Protect route with middleware
router.get('/user/rejected', authMiddleware, RejectedUser); // Protect route with middleware
router.get('/user/waiting', authMiddleware, WaitingUser); // Protect route with middleware
router.post('/updateUserByEmail/:email', authMiddleware, updateUserByEmail); // Update user by email
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Requested User ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid User ID format');
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    const user = await User.findById(id); // Fetch user by _id
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      status: user.status,
      role: user.role,
      expiration_date: user.expiration_date,
    });
  } catch (error) {
    console.error('Error fetching user:', error.message); // Log full error details
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Categories Routes
router.post('/categories', upload.single('categoryImage'), createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id', upload.single('categoryImage'), updateCategory);
router.delete('/categories/:id', deleteCategory);
// course route 
router.get('/categories/:categoryId/courses',  getCoursesByCategory);

router.post('/courses', uploadimagecourse.single('courseimage'), createCourse); // Create a course
router.get('/courses', getAllCourses); // Get all courses
router.get('/courses/:id', getCourseById); // Get a specific course by ID
router.put('/courses/:id', uploadimagecourse.single('courseimage'), updateCourse); // Update a course
router.delete('/courses/:id', deleteCourse); // Delete a course
 // Express route to update 'Actif' status
 router.post('/updateActif', async (req, res) => {
  const { userId, Actif } = req.body;
  
  try {
    // Assuming you have a User model
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the Actif status
    user.Actif = Actif;
    await user.save();

    return res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update Actif status' });
  }
});


// Create a new chapter
router.post('/chapters', createChapter);

// Get all chapters
router.get('/chapters', getAllChapters);

// Get a chapter by ID
router.get('/chapters/:id', getChapterById);
router.put('/chapters/reorder', reorderChapters);

// Update a chapter by ID
router.put('/chapters/:id', updateChapter);

// Delete a chapter by ID
router.delete('/chapters/:id', deleteChapter);

// Get chapters by course ID
router.get('/chapters/course/:courseId', getChaptersByCourse);

// Reorder chapters

router.get('/courses/:course_Id', async (req, res) => {
  try {
    const { course_Id } = req.params;
    const course = await Coursemodel.findById(course_Id).populate('category'); // Populate the category if it's a reference
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//================================================================================================


// *** Title Routes ***
router.post('/titles', addTitle); // Create a new title
router.get('/titles/:chapterId', getTitlesByChapter ); // Get titles by chapter
router.put('/titles/:id', updateTitle); // Update a title
router.delete('/titles/:id', deleteTitle); // Delete a title

// *** Subtitle Routes ***
router.post('/subtitles', addSubtitle); // Create a new subtitle
router.get('/subtitles/:chapterId', getSubtitlesByChapter); // Get subtitles by chapter
router.put('/subtitles/:id',updateSubtitle); // Update a subtitle
router.delete('/subtitles/:id',deleteSubtitle); // Delete a subtitle

// *** Description Routes ***
router.post('/descriptions', addDescription); // Create a new description
router.get('/descriptions/:chapterId', getDescriptionsByChapter); // Get descriptions by chapter
router.put('/descriptions/:id', updateDescription); // Update a description
router.delete('/descriptions/:id', deleteDescription); // Delete a description

// *** Image Routes ***
router.post('/images', addImage); // Create a new image
router.get('/images/:chapterId', getImagesByChapter); // Get images by chapter
router.put('/images/:id', updateImage); // Update an image
router.delete('/images/:id', deleteImage); // Delete an image

// *** Code Snippet Routes ***
router.post('/code-snippets', addCodeSnippet); // Create a new code snippet
router.get('/code-snippets/:chapterId', getCodeSnippetsByChapter); // Get code snippets by chapter
router.put('/code-snippets/:id', updateCodeSnippet); // Update a code snippet
router.delete('/code-snippets/:id', deleteCodeSnippet); // Delete a code snippet

// *** Note Routes ***
router.post('/notes',addNote); // Create a new note
router.get('/notes/:chapterId', getNotesByChapter); // Get notes by chapter
router.put('/notes/:id', updateNote); 
router.delete('/notes/:id', deleteNote); 

// *** List Routes ***
router.post('/lists', addListItem); 
router.get('/lists/:chapterId', getListByChapter); 
router.put('/lists/:id', updateListItem);
router.delete('/lists/:id', deleteListItem);

router.put('/updateIndexes', updateIndexes);

router.delete('/deleteContent/:id', deleteContent);


// Backend Route (e.g., Node.js with Express)
const authenticateToken = require('../middleware/authenticateToken');
const Coursemodel = require('../models/Coursemodel');

router.post('/logout', authenticateToken, logoutUser);


router.get('/lastIndex/:chapterId',getLastIndex);

router.get('/popups/:elementId', getPopups);

// Create a new pop-up
router.post('/popups', createPopup);

router.get('/element/:elementId', getElementContent);
router.delete('/popups/:id', async (req, res) => {
  const popupId = req.params.id; // Get the popup ID from the URL parameter

  try {
    // Delete the popup by its ID
    const deletedPopup = await Popup.findByIdAndDelete(popupId);

    // Check if the popup exists and was deleted
    if (!deletedPopup) {
      return res.status(404).json({ message: 'Popup not found' });
    }

    // Return a success message
    return res.status(200).json({ message: 'Popup deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/getpopup', async (req, res) => {
  const { element_id, word_or_phrase } = req.query;
  console.log('Received request for:', element_id, word_or_phrase); // Log the params
  
  try {
    const popup = await Popup.findOne({ element_id, word_or_phrase });
    if (popup) {
      res.json(popup);
    } else {
      res.status(404).json({ message: 'Pop-up not found' });
    }
  } catch (error) {
    console.error('Error fetching pop-up:', error); // Log any server errors
    res.status(500).json({ message: 'Server error', error });
  }
});
router.put('/popups/:id', async (req, res) => {
  const popupId = req.params.id; // Get popup id from the URL parameter
  const newPopupData = req.body; // Get the new data from the request body

  try {
    // Find the popup by ID and update it
    const popup = await Popup.findByIdAndUpdate(popupId, newPopupData, { new: true, runValidators: true });

    // Check if the popup exists
    if (!popup) {
      return res.status(404).json({ message: 'Popup not found' });
    }

    // Return the updated popup
    return res.status(200).json(popup);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});




module.exports = router;
