const Category = require('../models/CategorieModel');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Ensure the uploads directory is publicly accessible
  },
  filename: (req, file, cb) => {
    // Save the file with its original name, without the 'uploads/' prefix
    cb(null, file.originalname); // Save with original name only
  },
});

const upload = multer({ storage });

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description, language } = req.body;

    if (!name || !description || !language) {
      return res.status(400).json({ message: 'Name, description, and language are required' });
    }

    // Get the image path, if uploaded
    const categoryImage = req.file ? req.file.originalname : null; // Only the file name

    const newCategory = new Category({
      name,
      description,
      categoryImage, // Just store the name of the image, not the full path
      language, // Include the language field
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};


const getCategories = async (req, res) => {
  try {
    const { language } = req.query; // Optional language filter
    const query = language ? { language } : {}; // Filter by language if provided
    const categories = await Category.find(query);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};


// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, language } = req.body;

    const categoryImage = req.file ? req.file.originalname : null;

    const updatedData = { name, description, language };
    if (categoryImage) updatedData.categoryImage = categoryImage;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};


// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  upload, // Export upload middleware for routes
};
