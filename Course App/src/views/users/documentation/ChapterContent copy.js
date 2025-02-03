import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CCol, CRow, CButton, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheck, cilCheckCircle, cilClipboard, cilDescription, cilMediaPlay, cilNotes, cilWarning } from '@coreui/icons';
import axios from 'axios';
import './EnglishPage.css';
import { useColorModes } from '@coreui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { 
  dracula, 
  darcula, 
  vscDarkPlus, 
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { right } from '@popperjs/core';
const Contentchapter = () => {
  const { chapter_id } = useParams(); // Fetch chapter_id from URL
  const [content, setContent] = useState([]);
  const [popups, setPopups] = useState({});
  const [selectedWord, setSelectedWord] = useState(''); // Store the clicked word
  const [selectedPopupContent, setSelectedPopupContent] = useState(''); // Store popup content
  const [isModalVisible, setIsModalVisible] = useState(false); // Toggle modal visibility
  const customizedDarcula = {
    ...darcula,
    'code[class*="language-"]': {
      ...darcula['code[class*="language-"]'],
      background: '#000',
      borderRadius:10,
    },
    'pre[class*="language-"]': {
      ...darcula['pre[class*="language-"]'],
      background: '#000',
      borderRadius:10

    },
  };
  
  const customizedDracula = {
    ...dracula,
    'code[class*="language-"]': {
      ...dracula['code[class*="language-"]'],
      background: '#000',
      borderRadius:10

    },
    'pre[class*="language-"]': {
      ...dracula['pre[class*="language-"]'],
      background: '#000',
      borderRadius:10

    },
  };
  
  const customizedVscDarkPlus = {
    ...vscDarkPlus,
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: '#000',
      fontSize: '14px',
      borderRadius:10

    },
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#000',
      fontSize: '14px',
      borderRadius:10

    },
  };
  
  // Store all themes in an object
  const themes = {
    dark: customizedDracula,
    light: customizedDarcula,
    blue: customizedVscDarkPlus,
  };
  // Fetch all content by chapter ID
  const fetchAllContent = async (chapter) => {
    try {
      const [titles, subtitles, descriptions, images, codeSnippets, notes, lists] = await Promise.all([
        axios.get(`http://localhost:5000/api/auth/titles/${chapter}`),
        axios.get(`http://localhost:5000/api/auth/subtitles/${chapter}`),
        axios.get(`http://localhost:5000/api/auth/descriptions/${chapter}`),
        axios.get(`http://localhost:5000/api/auth/images/${chapter}`),
        axios.get(`http://localhost:5000/api/auth/code-snippets/${chapter}`),
        axios.get(`http://localhost:5000/api/auth/notes/${chapter}`),
        axios.get(`http://localhost:5000/api/auth/lists/${chapter}`),
      ]);

      return {
        titles: titles.data,
        subtitles: subtitles.data,
        descriptions: descriptions.data,
        images: images.data,
        codeSnippets: codeSnippets.data,
        notes: notes.data,
        lists: lists.data,
      };
    } catch (error) {
      console.error('Error fetching all content:', error);
      return {
        titles: [],
        subtitles: [],
        descriptions: [],
        images: [],
        codeSnippets: [],
        notes: [],
        lists: [],
      };
    }
  };

  // Fetch popups for individual words
  const fetchPopupContent = async (elementId, uniqueId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/getpopup`, {
        params: {
          element_id: elementId,
          word_or_phrase: uniqueId,
        },
      });
      return response.data.popup_content || 'No popup content available';
    } catch (error) {
      console.error('Error fetching popup content:', error);
      return 'Failed to load popup content';
    }
  };

  // Handle word click
  const handleWordClick = async (elementId, uniqueId, word) => {
    setSelectedWord(word);
    try {
      // Fetch the popup content for the clicked word
      const popupContent = await fetchPopupContent(elementId, uniqueId);
      setSelectedPopupContent(popupContent);
      setIsModalVisible(true); // Show the modal
    } catch (error) {
      console.error('Error fetching pop-up content:', error);
    }
  };

  // Render content with popups
  const renderContentWithPopups = (content, elementId, type) => {
    if (typeof content !== 'string') return null;
  
    const words = content.split(/(\s+|[.,!?;()]+)/).filter(Boolean);
  
    const renderWords = words.map((word, index) => {
      const uniqueId = `${word}-${index}`;
      const elementPopups = popups[elementId] || [];
      const popup = elementPopups.find((p) => p.word_or_phrase === uniqueId);
  
      return (
        <span key={uniqueId} style={{ display: 'inline' }}>
          {popup ? (
            // Render word as a clickable button if a popup exists
            <span
              onClick={() => handleWordClick(elementId, uniqueId, word.trim())}
              style={{
                textDecoration: 'underline',
                textDecorationColor: '#e47234', // Sets the underline color to green
              }}

            >
              {word}
            </span>
          ) : (
            // Render word as plain text if no popup is associated
            <span style={{ cursor: 'default' }}>
              {word}
            </span>
          )}
        </span>
      );
    });
  
    // Wrap the rendered words in the appropriate tag based on the type
    switch (type) {
      case 'title':
        return <h1>{renderWords}</h1>;
      case 'subtitle':
        return <h4>{renderWords}</h4>;
      case 'description':
        return <p>{renderWords}</p>;
      default:
        return <div>{renderWords}</div>;
    }
  };
   useEffect(() => {
    if (chapter_id) {
      fetchAllContent(chapter_id)
        .then(async (data) => {
          const allContent = [
            ...data.titles.map((item) => ({ ...item, type: 'title' })),
            ...data.subtitles.map((item) => ({ ...item, type: 'subtitle' })),
            ...data.descriptions.map((item) => ({ ...item, type: 'description' })),
            ...data.images.map((item) => ({ ...item, type: 'image' })),
            ...data.codeSnippets.map((item) => ({ ...item, type: 'codeSnippet' })),
            ...data.notes.map((item) => ({ ...item, type: 'note' })),
            ...data.lists.map((item) => ({ ...item, type: 'list' })),
          ];
  
          allContent.sort((a, b) => a.index - b.index);
          setContent(allContent);
  
          const popupRequests = allContent.map((item) =>
            axios.get(`http://localhost:5000/api/auth/popups/${item._id}`).then((res) => ({
              elementId: item._id,
              popups: res.data,
            }))
          );
  
          try {
            const popupResponses = await Promise.all(popupRequests);
            const popupData = {};
            popupResponses.forEach(({ elementId, popups }) => {
              popupData[elementId] = popups;
            });
            setPopups(popupData);
          } catch (error) {
            console.error('Error fetching popups for elements:', error);
          }
        })
        .catch((error) => {
          console.error('Error fetching content:', error);
        });
    }
  }, [chapter_id]);
  
 const { colorMode } = useColorModes('coreui-free-react-admin-template-theme'); // Get the current color mode
  const [selectedTheme, setSelectedTheme] = useState(themes[colorMode] || customizedDracula);

  // Update theme dynamically when colorMode changes
  useEffect(() => {
    if (colorMode === 'dark') {
      setSelectedTheme(customizedDracula);
    } else if (colorMode === 'light') {
      setSelectedTheme(customizedDarcula);
    } else if (colorMode === 'blue') {
      setSelectedTheme(customizedVscDarkPlus);
    }
  }, [colorMode]); // Trigger only when `colorMode` changes
  const renderWordsWithPopups = (content, elementId) => {
    if (typeof content !== 'string') return null;

    // Split content into words, preserving spaces and punctuation
    const words = content.split(/(\s+|[.,!?;()]+)/).filter(Boolean);

    return (
        <div style={{
            marginTop: '20px',
            padding: '10px',
            borderRadius: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            textAlign: textAlignment, // Apply dynamic text alignment here

        }}>
            {words.map((word, index) => {
                const uniqueId = `${word}-${index}`;
                const elementPopups = popups[elementId] || [];
                const popup = elementPopups.find((p) => p.word_or_phrase === uniqueId);

                // Only render the word if it has a popup associated with it
                if (popup) {
                    return (
                        <span key={uniqueId} style={{ display: 'inline-flex' }}>
                            <CButton
                                color="link"
                                onClick={() => handleWordClick(elementId, uniqueId, word.trim())}
                                style={{
                                  textAlign: textAlignment,
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: '15px',
                                    background: '#44475a',
                                    border: '1px solid #44475a',
                                    color: '#f8f8f2',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.target.style.background = '#292a3c')}
                                onMouseLeave={(e) => (e.target.style.background = '#1e1e2e')}
                            >
                                #{word}
                            </CButton>
                        </span>
                    );
                }

                return null; // Ignore words without popups
            })}
        </div>
    );
};

  const [isCopied, setIsCopied] = useState(false); // Track copy action
  const [isResultComplete, setIsResultComplete] = useState(false); // Track result completion
  const [showResult, setShowResult] = useState({});
  const [typedResult, setTypedResult] = useState({});
  
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false); // Reset icon after 1s
      }, 1000);
    });
  };

  const handleSeeResult = (codeResults, itemId) => {
    setShowResult((prev) => ({ ...prev, [itemId]: true })); // Show result for this specific item
    setTypedResult((prev) => ({ ...prev, [itemId]: '' })); // Clear previous result for this item
  
    if (codeResults) {
      let i = -1;
      const interval = setInterval(() => {
        setTypedResult((prev) => ({
          ...prev,
          [itemId]: prev[itemId] + codeResults[i],
        }));
        i++;
        if (i === codeResults.length-1) clearInterval(interval);
      }, 50);
    }
  };
  
  const languages = [
    { id: 1, name: 'Moroccan Arabic', displayName: 'الدارجة المغربية', flag: 'https://flagcdn.com/w320/ma.png', page: '/Categories' },
    { id: 2, name: 'Egyptian Arabic', displayName: 'العربية المصرية', flag: 'https://flagcdn.com/w320/eg.png', page: '/Categories' },
    { id: 3, name: 'French', displayName: 'Français', flag: 'https://flagcdn.com/w320/fr.png', page: '/Categories' },
    { id: 4, name: 'English', displayName: 'English', flag: 'https://flagcdn.com/w320/gb.png', page: '/Categories' },
    { id: 5, name: 'Classical Arabic', displayName: 'العربية الفصحى', flag: 'https://flagcdn.com/w320/sa.png', page: '/Categories' },
  ];
  const [textAlignment, setTextAlignment] = useState('left'); // Default alignment
  useEffect(() => {
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'English'; // Default to 'English'
    const language = languages.find(lang => lang.name === selectedLanguage);
    
    // Set text alignment based on language
    if (language && (language.name.includes('Arabic'))) {
      setTextAlignment('right'); // Align right for Arabic
    } else {
      setTextAlignment('left');  // Align left for others
    }
  }, []);
  
  return (
    <>
      <CRow className="justify-content-center ">
        {content.map((item) => (
          <CCol key={item._id} md={12} className="mb-3">
            {item.type === 'title' && <h1 style={{ textAlign: textAlignment }} className="content-title">{renderContentWithPopups(item.title, item._id)}</h1>}
            {item.type === 'subtitle' && <h4 style={{ textAlign: textAlignment }} className="content-subtitle">{renderContentWithPopups(item.subtitle, item._id)}</h4>}
            {item.type === 'description' && <p style={{ textAlign: textAlignment }} className="content-description">{renderContentWithPopups(item.description, item._id)}</p>}
            {item.type === 'list' && (
            <ul style={{ textAlign: textAlignment, listStyleType: 'disc', paddingLeft: '20px' }} type="cercle ">
                <li>
                  {renderContentWithPopups(item.item, item._id)}  {/* Render the list item content with popups */}
                </li>

            </ul>
)}



          {item.type === 'image' && (
            <div style={{ textAlign: textAlignment }}>
              <img
                src={item.src} // Assuming each image object has an 'imageUrl' field
                alt={item.alt || 'Image'} // Provide a default alt text
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '20px' }}
              />
            </div>
          )}
           
           {item.type === 'note' && (
  <div style={{ 
    padding: '20px', 
    borderRadius: '12px', 
    marginTop: '20px', 
    display: 'flex', 
    alignItems: 'flex-start',    // Align items to the top
    background: 'linear-gradient(135deg,rgb(158, 155, 146),rgb(173, 143, 68))',  // Gradient background
    color: 'white',              // White text on gradient background
  }}>

    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',    
      justifyContent: 'flex-start',
      width: '100%',              
    }}>
      <div style={{ 
        fontSize: '24px',           // Larger text size for title
        fontWeight: 'bold',         // Bold title
        marginBottom: '10px'        // Space below the title
      }}>
              <CIcon icon={cilNotes} style={{ 
        marginRight:5        // Space below the title
      }} />
        Note:
      </div>

      {/* Render the note content with popups */}
      <div style={{ 
        fontSize: '18px',           // Slightly larger text for the note content
        lineHeight: '1.5',          // Improve readability with line spacing
        textAlign: textAlignment,
      }}>
        {renderContentWithPopups(item.note, item._id)}
      </div>
    </div>
  </div>
)}
           { item.type === 'codeSnippet' && (
            <>      <div
            style={{
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)', // More pronounced shadow
              position: 'relative',
            }}
            
      >
        {/* Buttons Section */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <CButton style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleCopy(item.code)}>
        <CIcon icon={isCopied ? cilCheck : cilClipboard} />
      </CButton>
          {item.codeResults && (
           <CButton
           style={{ display: 'flex', alignItems: 'center' }}
           onClick={() => handleSeeResult(item.codeResults, item._id)}
         >
           <CIcon icon={showResult[item._id] ? cilCheckCircle : cilMediaPlay} />
         </CButton>
         
          
          )}
        </div>

        {/* Code Section */}
        <div style={{ marginTop: '20px' }}>
          <SyntaxHighlighter language="javascript" style={selectedTheme}>
            {item.code}
          </SyntaxHighlighter>
        </div>

        {/* Popup Words Section */}
        <div style={{ marginTop: '20px', textAlign: textAlignment }}>
          <h5 style={{ marginBottom: '10px'}}># Popup Words</h5>
          {renderWordsWithPopups(item.code, item._id)}
        </div>
        </div>

        {/* Results Section (Typing Effect) */}
        {showResult[item._id] && (
          <div
            style={{
              marginTop: '20px',
              textAlign: textAlignment,
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <h5>Result:</h5>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{typedResult[item._id]}</pre>
          </div>
        )}
        </>)}
          </CCol>
        ))}
      </CRow>

      <CModal 
  visible={isModalVisible} 
  onClose={() => setIsModalVisible(false)} 
  style={{
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'fixed', 
    top: '50%', 
    left: '50%', 
    textAlign: textAlignment,
    transform: 'translate(-50%, -50%)',
    zIndex: '1050', // Ensure the modal appears above other content
    maxWidth: '800px', // Optional: Set a max-width for the modal
    width: '100%' // Make it responsive
  }}
>
  <CModalHeader       className='Model'
 closeButton></CModalHeader>
  <CModalBody       className='Model'
  >{selectedPopupContent}</CModalBody>
  
</CModal>



    </>
  );
};

export default Contentchapter;
