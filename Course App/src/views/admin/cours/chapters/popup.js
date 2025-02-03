import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
} from '@coreui/react';

const PopupPage = () => {
  const { elementId } = useParams();
  const [elementType, setElementType] = useState('');
  const [elementContent, setElementContent] = useState({});
  const [popups, setPopups] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [newPopup, setNewPopup] = useState({
    chapter_id: '',
    element_id: elementId,
    word_or_phrase: '',
    popup_content: ''
  });

  useEffect(() => {
    // Fetch the element content by ID
    const selectedChapter = JSON.parse(localStorage.getItem('selectedChapter'));
    if (selectedChapter && selectedChapter._id) {
      setNewPopup((prevPopup) => ({ ...prevPopup, chapter_id: selectedChapter._id }));
    }

    const fetchElementContent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/element/${elementId}`);
        setElementType(response.data.type);
        setElementContent(response.data.content);
        console.log(elementContent)
      } catch (error) {
        console.error('Error fetching element content:', error);
      }
    };

    const fetchPopups = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/popups/${elementId}`);
        setPopups(response.data);
      } catch (error) {
        console.error('Error fetching pop-ups:', error);
      }
    };

    fetchElementContent();
    fetchPopups();
  }, [elementId]);

  const handleWordClick = async (uniqueId, word) => {
    setSelectedWord(word);
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/getpopup`, {
        params: {
          element_id: elementId,
          word_or_phrase: uniqueId
        }
      });
      if (response.data) {
        setNewPopup((prevPopup) => ({
          ...prevPopup,
          word_or_phrase: uniqueId,
          popup_content: response.data.popup_content,
          _id: response.data._id
        }));
      } else {
        setNewPopup((prevPopup) => ({ ...prevPopup, word_or_phrase: uniqueId, popup_content: '', _id: undefined }));
      }
    } catch (error) {
      console.error('Error fetching pop-up content:', error);
      setNewPopup((prevPopup) => ({ ...prevPopup, word_or_phrase: uniqueId, popup_content: '', _id: undefined }));
    }
    setPopupVisible(true);
  };

  const handleSavePopup = async () => {
    try {
      // Check if popup already exists based on elementId and word_or_phrase (or any other unique field)
      const existingPopup = popups.find(popup => popup.element_id === elementId && popup.word_or_phrase === newPopup.word_or_phrase);

      if (existingPopup) {
        // If popup exists, update it (PUT request)
        const response = await axios.put(`http://localhost:5000/api/auth/popups/${existingPopup._id}`, newPopup);
        console.log('Popup updated:', response.data);
      } else {
        // Otherwise, create a new popup (POST request)
        const response = await axios.post(`http://localhost:5000/api/auth/popups`, newPopup);
        console.log('Popup created:', response.data);
      }

      setPopupVisible(false);

      // Fetch and update the list of popups after the update operation
      const popupsResponse = await axios.get(`http://localhost:5000/api/auth/popups/${elementId}`);
      setPopups(popupsResponse.data);
    } catch (error) {
      if (error.response) {
        console.error('Error while updating popup:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleDeletePopup = async () => {
    // Check if the newPopup object has an _id
    if (!newPopup._id) {
      console.error('No popup ID found for deletion');
      return;  // Exit the function if no ID is available
    }

    try {
      console.log('Deleting popup:', newPopup._id); // Logging the popup ID for debugging

      // Send DELETE request to the backend
      const response = await axios.delete(`http://localhost:5000/api/auth/popups/${newPopup._id}`);

      if (response.status === 200) {
        console.log('Popup deleted successfully');
      } else {
        console.error('Failed to delete popup', response);
        return;
      }

      // Hide the popup after deletion
      setPopupVisible(false);

      // Fetch the updated list of popups
      const popupsResponse = await axios.get(`http://localhost:5000/api/auth/popups/${elementId}`);

      // Update the state with the new list of popups
      setPopups(popupsResponse.data);

    } catch (error) {
      console.error('Error deleting popup:', error); // Error handling
    }
  };

  const renderContentWithPopups = (content) => {
    if (typeof content !== 'string') {
      return null;
    }

    // Use a regular expression to split the content by words and punctuation
    const words = content.split(/(\s+|[.,!?;()]+)/).filter(Boolean);

    return words.map((word, index) => {
      const uniqueId = `${word}-${index}`;
      const popup = popups.find(p => p.word_or_phrase === uniqueId);
      return (
        <span key={uniqueId} style={{ display: 'inline' }}>
          {popup ? (
            <CButton
              color="link"
              onClick={() => handleWordClick(uniqueId, word.trim())}
              style={{
                textDecoration: 'underline',
                color: '#5352ad',
                padding: '2px 4px',
                margin: '0 2px',
                cursor: 'pointer'
              }} // Style words with pop-ups as links
            >
              {word}
            </CButton>
          ) : (
            <span onClick={() => handleWordClick(uniqueId, word.trim())} style={{ cursor: 'pointer' }}>
              {word}
            </span>
          )}
        </span>
      );
    });
  };

  const renderElementContent = () => {
    if (!elementType || !elementContent) {
      return <p>Loading...</p>;
    }

    switch (elementType) {
      case 'title':
        return <h1>{renderContentWithPopups(elementContent.title)}</h1>;
      case 'subtitle':
        return <h2>{renderContentWithPopups(elementContent.subtitle)}</h2>;
      case 'description':
        return <p>{renderContentWithPopups(elementContent.description)}</p>;
      case 'image':
        return (
          <div>
            <img src={elementContent.src} alt={elementContent.alt} style={{ maxWidth: '100%' }} />
            <p>{renderContentWithPopups(elementContent.alt)}</p>
          </div>
        );
      case 'codesnippet':
        return (
          <div
          style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '15px',
            borderRadius: '5px',
            overflowX: 'auto',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            position: 'relative',
          }}
>
<pre style={{ margin: 0 }}>

    <code>{renderContentWithPopups(elementContent.code)}</code>
  </pre>
  <div
      style={{
        background: 'gray',
        color: '#333',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '10px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
      }}
    >
  <pre >{renderContentWithPopups(elementContent.codeResults)}</pre >
  </div>


</div>


        
        );
      case 'note':
        return <p>{renderContentWithPopups(elementContent.note)}</p>;
      case 'list':
        return <ul><li>{renderContentWithPopups(elementContent.item)}</li></ul>;
      default:
        return <p>Unknown element type: {elementType}</p>;
    }
  };

  return (
    <div>
      <h3>Element Content</h3>
      <div>{renderElementContent()}</div>

      <CModal visible={popupVisible} onClose={() => setPopupVisible(false)}>
        <CModalHeader onClose={() => setPopupVisible(false)}>
          <CModalTitle>Add Pop-up</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="word_or_phrase">Word or Phrase</CFormLabel>
            <CFormInput
              type="text"
              id="word_or_phrase"
              value={selectedWord}
              disabled
            />
            <CFormLabel htmlFor="popup_content">Pop-up Content</CFormLabel>
            <CFormTextarea
              id="popup_content"
              value={newPopup.popup_content}
              onChange={(e) => setNewPopup({ ...newPopup, popup_content: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-between align-items-center gap-2">
          <CButton 
            color="secondary" 
            variant="outline" 
            onClick={() => setPopupVisible(false)} 
            className="px-4 d-flex align-items-center gap-1"
          >
            <i className="bi bi-x-circle"></i> Close
          </CButton>
  
          <CButton 
            color="primary" 
            onClick={handleSavePopup} 
            className="px-4 d-flex align-items-center gap-1"
          >
            <i className="bi bi-save"></i> Save
          </CButton>
  
          <CButton 
            color="danger" 
            onClick={handleDeletePopup} 
            className="px-4 d-flex align-items-center gap-1"
          >
            <i className="bi bi-trash"></i> Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default PopupPage;
