import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CContainer,
  CRow,
  CCol,
  CCardBody,
  CCardImage,
  CCardText,
  CButton,
} from '@coreui/react';
import './Language.css';

const Chooselanguage = () => {
  const navigate = useNavigate();
  const [jwtDecode, setJwtDecode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null); // Track chosen language

  const languages = [
    {
      id: 1,
      name: 'Moroccan Arabic',
      image: 'https://flagcdn.com/w320/ma.png',
      description: 'Manage content for Moroccan Arabic.',
      page: '/DefaultLayout',
    },
    {
      id: 2,
      name: 'Egyptian Arabic',
      image: 'https://flagcdn.com/w320/eg.png',
      description: 'Oversee Egyptian Arabic content and resources.',
      page: '/DefaultLayout',
    },
    {
      id: 3,
      name: 'French',
      image: 'https://flagcdn.com/w320/fr.png',
      description: 'Control and update French language content.',
      page: '/DefaultLayout',
    },
    {
      id: 4,
      name: 'English',
      image: 'https://flagcdn.com/w320/gb.png',
      description: 'Manage and organize English content effectively.',
      page: '/DefaultLayout',
    },
    {
      id: 5,
      name: 'Classical Arabic',
      image: 'https://flagcdn.com/w320/sa.png',
      description: 'Handle Classical Arabic materials and content.',
      page: '/DefaultLayout',
    },
  ];

  useEffect(() => {
    import('jwt-decode')
      .then((module) => {
        setJwtDecode(() => module.default || module.jwtDecode || module);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading jwt-decode:', err);
        setLoading(false);
      });
  }, []);

  // Handle Language Selection
  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', JSON.stringify(language)); // Save in local storage for future use
    navigate(language.page); // Navigate to the selected language page
  };

  return (
    <div className="language-page">
      <CContainer className="text-center mt-4">
        <h1 className="display-4 fw-bold">Select a Language to Manage</h1>
        <p className="lead text-secondary">
          As an admin, choose a language to oversee its content and resources.
        </p>
      </CContainer>

      <CContainer className="py-5">
        <CRow className="justify-content-center g-4">
          {languages.map((lang, index) => (
            <CCol xs={12} sm={6} md={4} lg={3} key={lang.id}>
              <div
                className="language-card"
                onClick={() => handleLanguageClick(lang)}
                style={{ animationDelay: `${index * 0.2}s`, cursor: 'pointer' }}
              >
                <div className="card-content">
                  <CCardImage
                    src={lang.image}
                    className="language-card-image"
                    alt={lang.name}
                  />
                  <CCardBody className="text-center">
                    <h4 className="fw-bold text-dark">{lang.name}</h4>
                    <CCardText className="text-secondary">
                      {lang.description}
                    </CCardText>
                    <CButton color="primary" className="explore-btn">
                      Manage Content ⚙️
                    </CButton>
                  </CCardBody>
                </div>
              </div>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </div>
  );
};

export default Chooselanguage;
