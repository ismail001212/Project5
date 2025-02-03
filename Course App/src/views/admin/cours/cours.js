import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CFormSelect,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CFormTextarea,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilOptions, cilPlus } from '@coreui/icons';
import {  useNavigate } from 'react-router-dom';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('title');
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    language: '',
    courseimage: '',
    category: '',
  });
  const [courseImageFile, setCourseImageFile] = useState(null);
  const navigate = useNavigate();

  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('selectedLanguage') || 'English');

  // Fetch Courses and Categories
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [currentLanguage]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 500); // Debounce search

    return () => clearTimeout(delayDebounce);
  }, [search, selectedSearchField]);

  const fetchCourses = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/auth/courses', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const filteredCourses = response.data
          .filter((course) => course.language === currentLanguage)
          .filter((course) => {
            if (!search.trim()) return true;
            const searchTerm = search.toLowerCase();
            return selectedSearchField === 'title'
              ? course.title.toLowerCase().includes(searchTerm)
              : course.description.toLowerCase().includes(searchTerm);
          });
        setCourses(filteredCourses);
      })
      .catch((error) => console.error('Error fetching courses:', error));
  };

  const fetchCategories = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/auth/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const filteredCategories = response.data.filter(
          (category) => category.language === currentLanguage
        );
        setCategories(filteredCategories);
      })
      .catch((error) => console.error('Error fetching categories:', error));
  };

  const handleSaveCourse = async () => {
    try {
      if (!newCourse.title.trim()) {
        alert('Please provide a course title.');
        return;
      }

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', newCourse.title.trim());
      formData.append('description', newCourse.description.trim());
      formData.append('language', currentLanguage);
      formData.append('category', newCourse.category);

      if (courseImageFile) {
        formData.append('courseimage', courseImageFile);
      }

      const url = isEditing
        ? `http://localhost:5000/api/auth/courses/${newCourse._id}`
        : 'http://localhost:5000/api/auth/courses';

      const method = isEditing ? 'PUT' : 'POST';

      await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });

      fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddCourse = () => {
    setIsEditing(false);
    setNewCourse({
      title: '',
      description: '',
      language: currentLanguage,
      courseimage: '',
      category: '',
    });
    setCourseImageFile(null);
    setVisible(true);
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setNewCourse({
      _id: course._id,
      title: course.title,
      description: course.description,
      language: course.language,
      category: course.category?._id || '', // Ensure category ID is set
    });
    setCourseImageFile(null); // Reset file input
    setVisible(true);
  };
  
  const resetForm = () => {
    setVisible(false);
    setNewCourse({ title: '', description: '', language: currentLanguage, courseimage: '', category: '' });
    setCourseImageFile(null);
    setIsEditing(false);
  };

  const handleNavigate = (course) => {
    localStorage.setItem('selectedCourse', JSON.stringify(course));

    navigate('/DefaultLayout/Chapters');
  };
  const handleDelete = (courseId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this course?');

    if (confirmDelete) {
      const token = localStorage.getItem('token');

      // Make the delete request to your API
      axios
        .delete(`http://localhost:5000/api/auth/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          // Successfully deleted the course, refresh the courses list
          fetchCourses();
          alert('Course deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting course:', error);
          alert('Failed to delete the course.');
        });
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardBody>
            <div className="d-flex justify-content-between mb-3">
              <CFormInput
                type="search"
                placeholder={`Search by ${selectedSearchField}...`}
                className="w-25"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <CFormSelect
                className="w-25"
                value={selectedSearchField}
                onChange={(e) => setSelectedSearchField(e.target.value)}
              >
                <option value="title">Title</option>
                <option value="description">Description</option>
              </CFormSelect>
              <CButton color="primary" onClick={handleAddCourse}>
                <CIcon icon={cilPlus} /> Add Course
              </CButton>
            </div>

            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Language</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {courses.map((course) => (
                  <CTableRow key={course._id}>
                    <CTableDataCell>{course.title}</CTableDataCell>
                    <CTableDataCell>{course.description}</CTableDataCell>
                    <CTableDataCell>{course.language}</CTableDataCell>
                    <CTableDataCell>{course.category?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell >
                      <CDropdown variant="" alignment="end">
                        <CDropdownToggle color="" variant="" caret={false}>
                          <CIcon icon={cilOptions} style={{ cursor: 'pointer' }} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => handleEdit(course)}>Edit</CDropdownItem>
                          <CDropdownItem onClick={() => handleNavigate(course)}>Details</CDropdownItem>
                          <CDropdownItem onClick={() => handleDelete(course._id)}>Delete</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                    
                    
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      
      {/* Add/Edit Course Modal */}
      <CModal visible={visible} onClose={resetForm}>
        <CModalHeader>
          <CModalTitle>{isEditing ? 'Edit Course' : 'Add Course'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Course Title</CFormLabel>
            <CFormInput
              type="text"
              placeholder='Course Title'

              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              required
            />
            <CFormLabel>Description</CFormLabel>
            <CFormTextarea
              placeholder='Description'

              type="text"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              required
            />
            <CFormLabel>Category</CFormLabel>
            <CFormSelect
              value={newCourse.category || ''}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
            >
              <option value="" disabled>
                -- Select Category --
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </CFormSelect>

            <CFormLabel>Course Image</CFormLabel>
            <CFormInput
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setCourseImageFile(file);
                setNewCourse((prev) => ({
                  ...prev,
                  courseimage: file ? file.name : '', // Set filename in `newCourse.courseimage`
                }));
              }}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetForm}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveCourse}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default Course;
