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
  cilUser
} from '@coreui/icons';

import { AppHeaderDropdown } from './header/index';

const AppHeader = () => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Sample user information (you could fetch this from your global state or API)
  const user = useSelector(state => state.user); // Assume `state.user` holds user information
  const { name, avatar } = user || {}; // Destructure user info

  // Languages array with flag URLs
  const languages = [
    { id: 1, name: 'Moroccan Arabic', flag: 'https://flagcdn.com/w320/ma.png', page: '/DefaultLayout' },
    { id: 2, name: 'Egyptian Arabic', flag: 'https://flagcdn.com/w320/eg.png', page: '/DefaultLayout' },
    { id: 3, name: 'French', flag: 'https://flagcdn.com/w320/fr.png', page: '/DefaultLayout' },
    { id: 4, name: 'English', flag: 'https://flagcdn.com/w320/gb.png', page: '/DefaultLayout' },
    { id: 5, name: 'Classical Arabic', flag: 'https://flagcdn.com/w320/sa.png', page: '/DefaultLayout' },
  ];

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name); // Set selected language
    localStorage.setItem('selectedLanguage', language.name); // Store in local storage
    navigate(language.page); // Navigate to the selected language's page
  };

  // Set default language to English on load if no language is stored in localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (!storedLanguage) {
      setSelectedLanguage('English'); // Set default to English if no language is stored
      localStorage.setItem('selectedLanguage', 'English'); // Store default language (English) in localStorage
    } else {
      setSelectedLanguage(storedLanguage); // Set stored language if available
    }
  }, []);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });
  }, []);

  // Handle user logout (clear token, reset user state, and redirect)
  // Handle user logout (invalidate token, update user state, and redirect)
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

  



  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav>
          {/* Language selection dropdown */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false} className="d-flex align-items-center">
              {selectedLanguage && (
                <>
                  <img
                    src={languages.find(lang => lang.name === selectedLanguage)?.flag}
                    alt={selectedLanguage}
                    style={{ width: '25px', height: '18px', marginRight: '10px' }}
                  />
                  <span>{selectedLanguage}</span>
                </>
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              {languages.map((lang) => (
                <CDropdownItem
                  key={lang.id}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`d-flex align-items-center ${selectedLanguage === lang.name ? 'active' : ''}`}
                >
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    style={{ width: '20px', height: '15px', marginRight: '10px' }}
                  />
                  {lang.name}
                  {selectedLanguage === lang.name && (
                    <CBadge color="primary" className="ms-2">Selected</CBadge>
                  )}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>

          {/* Theme toggle dropdown */}
          <CDropdown variant="nav-item" placement="bottom-end">
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
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
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

          {/* Profile dropdown */}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false} className="d-flex align-items-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  className="me-2"
                />
              ) : (
                <CIcon icon={cilUser} size="lg" className="me-2" />
              )}
              <span>{name || 'User'}</span>
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => navigate('/profile')}>
                View Profile
              </CDropdownItem>
              
              <CDropdownItem onClick={handleLogout}>
                Logout
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
