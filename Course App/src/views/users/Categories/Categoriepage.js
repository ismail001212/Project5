import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import CIcon from '@coreui/icons-react';

const EnglishPage = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [selectedLanguage]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const fetchCategories = () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);
    axios
      .get('http://localhost:5000/api/auth/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const filteredCategories = response.data.filter(
          (category) => category.language === selectedLanguage
        );
        setCategories(filteredCategories);
        setFilteredCategories(filteredCategories);
      })
      .catch((error) => {
        setError('Error fetching categories. Please try again later.');
        console.error('Error fetching categories:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const languageContent = {
    'Moroccan Arabic': {
      subtitle: 'ماذا تريد أن تتعلم؟',
      learnMoreButton: 'تصفح',
      search: 'ابحث عن فئة',
    },
    'Egyptian Arabic': {
      subtitle: 'ماذا تريد أن تتعلم؟',
      learnMoreButton: 'تصفح',
      search: 'ابحث عن فئة',
    },
    French: {
      subtitle: 'Que voulez-vous apprendre ?',
      learnMoreButton: 'Parcourir',
      search: 'Rechercher une catégorie',
    },
    English: {
      subtitle: 'What do you want to learn?',
      learnMoreButton: 'Browse',
      search: 'Search for a category',
    },
    'Classical Arabic': {
      subtitle: 'ماذا تريد أن تتعلم؟',
      learnMoreButton: 'تصفح',
      search: 'ابحث عن فئة',
    },
  };
  

  const isArabicLanguage = ['Moroccan Arabic', 'Egyptian Arabic', 'Classical Arabic'].includes(selectedLanguage);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  
  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <AppHeaderuser selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      <div className="body flex-grow-1">
        <div dir={isArabicLanguage ? 'rtl' : 'ltr'}>
          <CContainer className="text-center my-5">
            <CRow className="justify-content-center hero-content">
              <CCol xs={12} className="text-center">
                <p className="lead">{languageContent[selectedLanguage]?.subtitle}</p>
              </CCol>
            </CRow>
            <CFormInput
              type="text"
              placeholder={languageContent[selectedLanguage]?.search}
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input mb-4 mx-auto w-50"
            />
          </CContainer>

          <CContainer className="py-2">
            <CRow className="g-4 justify-content-center">
              {loading ? (
                <CCol xs={12} className="text-center">
                  <p>Loading categories...</p>
                </CCol>
              ) : error ? (
                <CCol xs={12} className="text-center">
                  <p>{error}</p>
                </CCol>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <CCol
                    xs={12}
                    sm={6} // for small screens, each takes up 50% (2 items per row)
                    md={4}  // for medium screens, each takes up 33.33% (3 items per row)
                    key={category.id}
                    className="fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CCard className="shadow-lg category-card d-flex flex-column">
                      <CCardHeader className="text-center p-4">
                        <img
                          src={`http://localhost:5000/uploads/${category.categoryImage}`}
                          alt={category.name}
                          width={100}
                          className="d-block mx-auto" // Ensures image is centered
                        />
                        <h5 className="mt-3">{category.name}</h5>
                      </CCardHeader>
                      <CCardBody className="text-center d-flex flex-column">
                        <p>{category.description}</p>
                        <div className="mt-auto">
                        <CButton
                        color="primary"
                        onClick={() => navigate(`/courses/${category._id}`)}                      >
                        {languageContent[selectedLanguage]?.learnMoreButton}
                      </CButton>
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))
              ) : (
                <CCol xs={12} className="text-center">
                  <p>No categories available for this language.</p>
                </CCol>
              )}
            </CRow>
          </CContainer>
        </div>
      </div>
    </div>
  );
};

export default EnglishPage;
