const Course = require('../models/Coursemodel');
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// @desc   Create a new course
// @route  POST /api/courses
// @access Private
exports.createCourse = async (req, res) => {
  try {
    const { title, description, language, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Course image is required' });
    }

    const newCourse = new Course({
      title,
      description,
      language,
      category,
      courseimage: req.file.originalname,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all courses
// @route  GET /api/courses
// @access Public
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('category');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single course by ID
// @route  GET /api/courses/:id
// @access Public
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('category');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Fetch courses where the category ID matches
    const courses = await Course.find({ category: categoryId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this category.' });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// @desc   Update course
// @route  PUT /api/courses/:id
// @access Private
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, language, category } = req.body;

    const updatedData = {
      title,
      description,
      language,
      category,
    };

    if (req.file) {
      updatedData.courseimage = req.file.path;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc   Delete course
// @route  DELETE /api/courses/:id
// @access Private
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove the image file from the server


    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
