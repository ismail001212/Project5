import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import axios from 'axios';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
} from '@coreui/react';
import './EnglishPage.css';
import { AppHeaderuser } from '../../../components';

const Courses = () => {
  const { categoryId } = useParams(); // Get categoryId from URL
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [courses, setCourses] = useState([]); // Holds fetched courses
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [categoryId, selectedLanguage]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCourses(filtered);
    }
  }, [searchQuery]);

  const fetchCourses = () => {
    const token = localStorage.getItem('token');
    setLoading(true);

    axios
      .get(`http://localhost:5000/api/auth/categories/${categoryId}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const languageContent = {
    'Moroccan Arabic': {
      subtitle: 'ماذا تريد أن تتعلم؟',
      learnMoreButton: 'تصفح',
      search: 'ابحث عن دورة',
    },
    'Egyptian Arabic': {
      subtitle: 'ماذا تريد أن تتعلم؟',
      learnMoreButton: 'تصفح',
      search: 'ابحث عن دورة',
    },
    French: {
      subtitle: 'Que voulez-vous apprendre ?',
      learnMoreButton: 'Parcourir',
      search: 'Rechercher une formation',
    },
    English: {
      subtitle: 'What do you want to learn?',
      learnMoreButton: 'Browse',
      search: 'Search for a course',
    },
    'Classical Arabic': {
      subtitle: 'ماذا تريد أن تتعلم؟',
      learnMoreButton: 'تصفح',
      search: 'ابحث عن دورة',
    },
  };

  const isArabicLanguage = ['Moroccan Arabic', 'Egyptian Arabic', 'Classical Arabic'].includes(
    selectedLanguage
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/Docs/${courseId}`);
  };

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <AppHeaderuser selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      <div className="body flex-grow-1">
        <div dir={isArabicLanguage ? 'rtl' : 'ltr'}>
          <CContainer className="text-center my-5">
            
            <CFormInput
              type="text"
              placeholder={languageContent[selectedLanguage]?.search}
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input mb-4 mx-auto w-50"
            />
          </CContainer>

          <CContainer className="py-5">
            <CRow className="g-4 justify-content-center">
              {loading ? (
                <CCol xs={12} className="text-center">
                  <p>Loading courses...</p>
                </CCol>
              ) :
             courses.length > 0 ? (
                courses.map((course, index) => (
                  <CCol
                    xs={12}
                    sm={6}
                    md={4}
                    key={course.id}
                    className="fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CCard className="shadow-lg category-card d-flex flex-column">
                      <CCardHeader className="text-center p-4">
                        <img
                          src={`http://localhost:5000/uploads/${course.courseimage}`}
                          alt={course.name}
                          width={100}
                          className="d-block mx-auto"
                        />
                        <h5 className="mt-3">{course.name}</h5>
                      </CCardHeader>
                      <CCardBody className="text-center d-flex flex-column">
                        <p className="text-muted">{course.description}</p>
                        <div className="mt-auto">
                          <CButton color="primary" onClick={() => handleCourseClick(course._id)}>
                            {languageContent[selectedLanguage]?.learnMoreButton}
                          </CButton>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))
              ) : (
                <CCol xs={12} className="text-center">
                  <p>No courses available for this category.</p>
                </CCol>
              )}
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  );
};

export default Courses;
