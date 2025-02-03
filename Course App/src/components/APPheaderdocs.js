import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilMenu,
  cilMoon,
  cilSun,
  cilContrast,
  cilUser,
  cilColorPalette,
  cilArrowBottom
} from '@coreui/icons';
import './style.css'
import { AppHeaderDropdown } from './header/index';

const APPheaderdocs = ({ selectedLanguage, setSelectedLanguage }) => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const navigate = useNavigate();


  // Sample user information (you could fetch this from your global state or API)
  const user = useSelector(state => state.user); // Assume `state.user` holds user information
  const { name, avatar } = user || {}; // Destructure user info

  // Languages array with flag URLs and display names
  const languages = [
    { id: 1, name: 'Moroccan Arabic', displayName: 'الدارجة المغربية', flag: 'https://flagcdn.com/w320/ma.png', page: '/Categories' },
    { id: 2, name: 'Egyptian Arabic', displayName: 'العربية المصرية', flag: 'https://flagcdn.com/w320/eg.png', page: '/Categories' },
    { id: 3, name: 'French', displayName: 'Français', flag: 'https://flagcdn.com/w320/fr.png', page: '/Categories' },
    { id: 4, name: 'English', displayName: 'English', flag: 'https://flagcdn.com/w320/gb.png', page: '/Categories' },
    { id: 5, name: 'Classical Arabic', displayName: 'العربية الفصحى', flag: 'https://flagcdn.com/w320/sa.png', page: '/Categories' },
  ];

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    localStorage.setItem('selectedLanguage', language.name);
    navigate(language.page);
  };

  // Set default language to English on load if no language is stored in localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, [setSelectedLanguage]);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });
  }, []);

  // Handle user logout (clear token, reset user state, and redirect)
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      navigate('/login');
      return;
    }

    try {
      // Make an API call to deactivate the user
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to log out user');
      }

      // Clear local storage and redirect
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };
  const handleThemeChange = (mode) => {
     setColorMode(mode); 
     window.location.reload();


  };


  useEffect(() => {
    document.body.setAttribute('data-theme', colorMode); // Sync theme with body attribute
  }, [colorMode]);
  const { course_Id } = useParams();
  const [categoryId, setCategoryId] = useState(null);
  useEffect(() => {
    const fetchCategoryId = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/courses/${course_Id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const course = await response.json();
        console.log('Fetched course:', course);
        const extractedCategoryId = course.category?._id || course.category?.id || course.category;
        setCategoryId(extractedCategoryId);
      } catch (error) {
        console.error('Error fetching category ID:', error);
      }
    };
  
    if (course_Id) {
      fetchCategoryId();
    }
  }, [course_Id]);
  
  
  console.log(categoryId)

  return (<CHeader position="sticky" className="mb-4 p-0 nav-bare" ref={headerRef}>
    <CContainer
      className="border-bottom px-4 d-flex justify-content-between align-items-center"
      fluid
    >
      {/* Left Side: Logo or Menu Toggle */}
      <div className="d-flex align-items-center">
        <CHeaderToggler
          className="men"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
      </div>
  
      {/* Center Section: Static Navigation Items */}
      
      {/* Right Side: Theme Toggle, Language Selector, and Profile */}
      <div className="d-flex align-items-center gap-3">
      <CDropdown variant="nav-item" placement="bottom-start">
          <CDropdownToggle caret={false}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <polygon points="12,16 6,10 18,10" fill="currentColor" />
</svg>

          </CDropdownToggle>
          <CDropdownMenu>
          
            <CDropdownItem
              className="d-flex align-items-center"
              as="button"
              type="button"
              onClick={() => navigate('/categories')}
              >
             Categories

            </CDropdownItem>
            {categoryId && (

            <CDropdownItem
              active={colorMode === 'dark'}
              className="d-flex align-items-center"
              as="button"
              type="button"
              onClick={() => {
                if (typeof categoryId === 'string' || typeof categoryId === 'number') {
                  navigate(`/courses/${categoryId}`);
                } else {
                  console.error('Invalid categoryId:', categoryId);
                }
              }}            >
            Similar Courses
            </CDropdownItem>)}
            
    
          </CDropdownMenu>
        </CDropdown>
  
        {/* Theme Toggle */}
        <CDropdown variant="nav-item" placement="bottom-start">
          <CDropdownToggle caret={false}>
            {colorMode === 'dark' ? (
              <CIcon icon={cilMoon} size="lg" />
            ) : colorMode === 'auto' ? (
              <CIcon icon={cilContrast} size="lg" />
            ) : (
              <CIcon icon={cilSun} size="lg" />
            )}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              active={colorMode === 'light'}
              className="d-flex align-items-center"
              as="button"
              type="button"
              onClick={() => handleThemeChange('light')}
            >
              <CIcon className="me-2" icon={cilSun} size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem
              active={colorMode === 'dark'}
              className="d-flex align-items-center"
              as="button"
              type="button"
              onClick={() => handleThemeChange('dark')}
            >
              <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem
              active={colorMode === 'blue'}
              onClick={() => handleThemeChange('blue')}
            >
              <CIcon className="me-2" icon={cilColorPalette} size="lg" /> Blue
            </CDropdownItem>
            <CDropdownItem
              active={colorMode === 'auto'}
              className="d-flex align-items-center"
              as="button"
              type="button"
              onClick={() => setColorMode('auto')}
            >
              <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
  
        {/* Language Selector */}
        <CDropdown variant="nav-item" placement="bottom-end" className="me-3">
          <CDropdownToggle caret={false} className="d-flex align-items-center">
            {selectedLanguage && (
              <>
                <img
                  src={languages.find((lang) => lang.name === selectedLanguage)?.flag}
                  alt={selectedLanguage}
                  style={{ width: '25px', height: '18px', marginRight: '10px' }}
                />
              </>
            )}
          </CDropdownToggle>
          <CDropdownMenu>
            {languages.map((lang) => (
              <CDropdownItem
                key={lang.id}
                onClick={() => handleLanguageSelect(lang)}
                className={`d-flex align-items-center ${
                  selectedLanguage === lang.name ? 'active' : ''
                }`}
              >
                <img
                  src={lang.flag}
                  alt={lang.name}
                  style={{ width: '20px', height: '15px', marginRight: '10px' }}
                />
                {lang.displayName}
                {selectedLanguage === lang.name && (
                  <CBadge color="primary" className="ms-2">
                    Selected
                  </CBadge>
                )}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>
  
        {/* Profile Dropdown */}
        <CDropdown variant="nav-item" placement="bottom-end"  className="me-3">
          <CDropdownToggle caret={false} className="d-flex align-items-center">
            <CIcon icon={cilUser} size="lg" className="me-2" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={handleLogout}>Logout</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>
    </CContainer>
  </CHeader>
     );
};

export default APPheaderdocs;
