import React, { useState, useEffect } from 'react';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormTextarea,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilImage, cilText, cilOptions, cilCode,  cilList, cilNotes, cilWarning, cilListRich, cilDescription, cilTextSize, cilMediaStop, cilMediaPlay } from '@coreui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import {
  fetchContent,
  fetchSubtitle,
  fetchDescription,
  fetchImage,
  fetchCodeSnippets,
  fetchNotes,
  fetchLists,
  getLastIndex,
  handleSaveContent,
  handleSaveSubtitle,
  handleSaveDescription,
  handleSaveImage,
  handleSaveCodeSnippet,
  handleSaveNote,
  handleSaveList,
  handleDeleteContent,
  handleDeleteCodeSnippet,
  handleDeleteNote,
  handleDeleteList,
  fetchAllContent,
} from './contentMthodes';
import { useNavigate } from 'react-router-dom';
const Contentchapter = () => {
  const [visible, setVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [codeSnippetVisible, setCodeSnippetVisible] = useState(false);
  const [noteVisible, setNoteVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubtitleEditing, setIsSubtitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [isCodeSnippetEditing, setIsCodeSnippetEditing] = useState(false);
  const [isNoteEditing, setIsNoteEditing] = useState(false);
  const [isListEditing, setIsListEditing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');
  const [course, setCourse] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [chapter, setchapter] = useState(null);
  const [newContent, setNewContent] = useState({
    chapterId: '',
    courseId: '',
    language: currentLanguage,
    index: 1,
    title: '',
  });
  const [newSubtitle, setNewSubtitle] = useState({
    chapterId: '',
    courseId: '',
    language: currentLanguage,
    index: 1,
    subtitle: '',
  });
  const [newDescription, setNewDescription] = useState({
    chapterId: '',
    courseId: '',
    language: currentLanguage,
    index: 1,
    description: '',
  });
  const [newImage, setNewImage] = useState({
    chapterId: '',
    courseId: '',
    language: currentLanguage,
    index: 1,
    src: '',
    alt: '',
  });
  const [newCodeSnippet, setNewCodeSnippet] = useState({
    chapterId: '',
    courseId: '',
    language: currentLanguage,
    index: 1,
    code: '',
    syntaxLanguage: '',
    codeResults: '',
  });
  const [newNote, setNewNote] = useState({
    chapterId: '',
    courseId: '',
    language: currentLanguage,
    index: 1,
    note: '',
  });
  const [newList, setNewList] = useState({
    chapterId: '',
    courseId: '',
    language: currentLanguage,
    index: 1,
    item: '',
  });
  const [content, setContent] = useState([]);

  useEffect(() => {
    const selectedCourse = localStorage.getItem('selectedCourse');
    if (selectedCourse) {
      const courseData = JSON.parse(selectedCourse);
      setCourse(courseData);
    }
  }, []);

  useEffect(() => {
    const selectedChapter = localStorage.getItem('selectedChapter');
    if (selectedChapter) {
      const chapterData = JSON.parse(selectedChapter);
      setchapter(chapterData._id);
    }
  }, []);

  useEffect(() => {
    if (chapter) {
      console.log('Chapter updated:', chapter);
      fetchAllContent(chapter).then((data) => {
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
      });
    }
  }, [chapter]);

  const updateContent = (newItems, type) => {
    if (!Array.isArray(newItems)) {
      newItems = [newItems];
    }
    setContent((prevContent) => {
      const filteredContent = prevContent.filter(item => item.type !== type);
      const updatedContent = [...filteredContent, ...newItems.map(item => ({ ...item, type }))];
      return updatedContent.sort((a, b) => a.index - b.index);
    });
  };

  const handleAddContent = async () => {
    setIsEditing(false);
    const nextIndex = await getLastIndex(chapter);
    setNewContent({
      chapterId: chapter,
      courseId: course._id,
      index: nextIndex,
      language: currentLanguage,
      title: '',
    });
    setVisible(true);
  };

  const handleAddSubtitle = async () => {
    setIsSubtitleEditing(false);
    const nextIndex = await getLastIndex(chapter);
    setNewSubtitle({
      chapterId: chapter,
      courseId: course._id,
      index: nextIndex,
      language: currentLanguage,
      subtitle: '',
    });
    setSubtitleVisible(true);
  };

  const handleAddDescription = async () => {
    setIsDescriptionEditing(false);
    const nextIndex = await getLastIndex(chapter);
    setNewDescription({
      chapterId: chapter,
      courseId: course._id,
      index: nextIndex,
      language: currentLanguage,
      description: '',
    });
    setDescriptionVisible(true);
  };

  const handleAddImage = async () => {
    setIsImageEditing(false);
    const nextIndex = await getLastIndex(chapter);
    setNewImage({
      chapterId: chapter,
      courseId: course._id,
      index: nextIndex,
      language: currentLanguage,
      src: '',
      alt: '',
    });
    setImageVisible(true);
  };

  const handleAddCodeSnippet = async () => {
    setIsCodeSnippetEditing(false);
    const nextIndex = await getLastIndex(chapter);
    setNewCodeSnippet({
      chapterId: chapter,
      courseId: course._id,
      index: nextIndex,
      language: currentLanguage,
      code: '',
      syntaxLanguage: '',
    });
    setCodeSnippetVisible(true);
  };

  const handleAddNote = async () => {
    setIsNoteEditing(false);
    const nextIndex = await getLastIndex(chapter);
    setNewNote({
      chapterId: chapter,
      courseId: course._id,
      index: nextIndex,
      language: currentLanguage,
      note: '',
    });
    setNoteVisible(true);
  };

  const handleAddList = async () => {
    setIsListEditing(false);
    const nextIndex = await getLastIndex(chapter);
    setNewList({
      chapterId: chapter,
      courseId: course._id,
      index: nextIndex,
      language: currentLanguage,
      item: '',
    });
    setListVisible(true);
  };

  const handleEditContent = (content) => {
    setIsEditing(true);
    setNewContent({ ...content, language: currentLanguage });
    setEditingId(content._id);
    setVisible(true);
  };

  const handleEditSubtitle = (subtitle) => {
    setIsSubtitleEditing(true);
    setNewSubtitle({ ...subtitle, language: currentLanguage });
    setEditingId(subtitle._id);
    setSubtitleVisible(true);
  };

  const handleEditDescription = (description) => {
    setIsDescriptionEditing(true);
    setNewDescription({ ...description, language: currentLanguage });
    setEditingId(description._id);
    setDescriptionVisible(true);
  };

  const handleEditImage = (image) => {
    setIsImageEditing(true);
    setNewImage({ ...image, language: currentLanguage });
    setEditingId(image._id);
    setImageVisible(true);
  };

  const handleEditCodeSnippet = (codeSnippet) => {
    setIsCodeSnippetEditing(true);
    setNewCodeSnippet({ ...codeSnippet, language: currentLanguage });
    setEditingId(codeSnippet._id);
    setCodeSnippetVisible(true);
  };

  const handleEditNote = (note) => {
    setIsNoteEditing(true);
    setNewNote({ ...note, language: currentLanguage });
    setEditingId(note._id);
    setNoteVisible(true);
  };

  const handleEditList = (list) => {
    setIsListEditing(true);
    setNewList({ ...list, language: currentLanguage });
    setEditingId(list._id);
    setListVisible(true);
  };

  const resetForm = () => {
    setVisible(false);
    setSubtitleVisible(false);
    setDescriptionVisible(false);
    setImageVisible(false);
    setCodeSnippetVisible(false);
    setNoteVisible(false);
    setListVisible(false);
    setNewContent({
      chapterId: '',
      courseId: '',
      language: currentLanguage,
      index: 1,
      title: '',
    });
    setNewSubtitle({
      chapterId: '',
      courseId: '',
      language: currentLanguage,
      index: 1,
      subtitle: '',
    });
    setNewDescription({
      chapterId: '',
      courseId: '',
      language: currentLanguage,
      index: 1,
      description: '',
    });
    setNewImage({
      chapterId: '',
      courseId: '',
      language: currentLanguage,
      index: 1,
      src: '',
      alt: '',
    });
    setNewCodeSnippet({
      chapterId: '',
      courseId: '',
      language: currentLanguage,
      index: 1,
      code: '',
      syntaxLanguage: '',
    });
    setNewNote({
      chapterId: '',
      courseId: '',
      language: currentLanguage,
      index: 1,
      note: '',
    });
    setNewList({
      chapterId: '',
      courseId: '',
      language: currentLanguage,
      index: 1,
      item: '',
    });
    setIsEditing(false);
    setIsSubtitleEditing(false);
    setIsDescriptionEditing(false);
    setIsImageEditing(false);
    setIsCodeSnippetEditing(false);
    setIsNoteEditing(false);
    setIsListEditing(false);
    setEditingId(null);
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
  
    const items = Array.from(content);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  
    // Update the indexes
    const updatedItems = items.map((item, index) => ({ ...item, index }));
  
    setContent(updatedItems);
  
    // Save the new order to the backend
    try {
      await axios.put('http://localhost:5000/api/auth/updateIndexes', { items: updatedItems });
    } catch (error) {
      console.error('Error updating indexes:', error);
    }
  };

  const handleDeleteContent = async (id, type) => {
    try {
      switch (type) {
        case 'title':
        case 'subtitle':
        case 'description':
        case 'image':
          await axios.delete(`http://localhost:5000/api/auth/deleteContent/${id}`, { data: { type } });
          break;
        case 'codeSnippet':
          await handleDeleteCodeSnippet(id, updateContent, chapter);
          break;
        case 'note':
          await handleDeleteNote(id, updateContent, chapter);
          break;
        case 'list':
          await handleDeleteList(id, updateContent, chapter);
          break;
        default:
          throw new Error('Invalid content type');
      }
      setContent((prevContent) => prevContent.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

 const [showResults, setShowResults] = useState(false);
const [typedResults, setTypedResults] = useState('');
const [typingStates, setTypingStates] = useState({});
const [isTyping, setIsTyping] = useState(false);
let typingInterval = null;
const typeResults = (id, results) => {
  if (typeof results !== 'string') {
    console.error('Invalid results:', results);
    return;
  }

  let index = 0;
  setTypingStates((prev) => ({
    ...prev,
    [id]: { typedResults: '', showResults: true, isTyping: true }
  }));

  const interval = setInterval(() => {
    if (index < results.length) {
      const char = results[index];
      if (char !== undefined) {
        setTypingStates((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            typedResults: prev[id].typedResults + char
          }
        }));
      }
      index++;
    } else {
      clearInterval(interval);
      setTypingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isTyping: false }
      }));
    }
  }, 100); // Adjust typing speed here
};

const stopTyping = (id) => {
  clearInterval(typingStates[id]?.interval);
  setTypingStates((prev) => ({
    ...prev,
    [id]: { ...prev[id], isTyping: false }
  }));
};
const navigate = useNavigate();


  return (
    <CRow className="justify-content-center">
      <CCol md={12}>
        <CCard className="shadow-lg mb-4">
          <CCardBody>
            <CRow>
            <CCol className="d-flex justify-content-center flex-wrap">
  <CButton
    color="primary"
    onClick={handleAddContent}
    className="mt-3 m-2"
  >
    <CIcon icon={cilText} /> 
  </CButton>
  <CButton
    color="primary"
    onClick={handleAddSubtitle}
    className="mt-3 m-2"
  >
    <CIcon icon={cilTextSize} /> 
  </CButton>
  <CButton
    color="primary"
    onClick={handleAddDescription}
    className="mt-3 m-2"
  >
    <CIcon icon={cilDescription} /> 
  </CButton>
  <CButton
    color="primary"
    onClick={handleAddImage}
    className="mt-3 m-2"
  >
    <CIcon icon={cilImage} /> 
  </CButton>
  <CButton
    color="primary"
    onClick={handleAddCodeSnippet}
    className="mt-3 m-2"
  >
    <CIcon icon={cilCode} /> 
  </CButton>
  <CButton
    color="primary"
    onClick={handleAddNote}
    className="mt-3 m-2"
  >
    <CIcon icon={cilWarning} /> 
  </CButton>
  <CButton
    color="primary"
    onClick={handleAddList}
    className="mt-3 m-2"
  >
    <CIcon icon={cilListRich} /> 
  </CButton>
</CCol>

            </CRow>

          </CCardBody>
        </CCard>
                    
            
<DragDropContext onDragEnd={handleOnDragEnd}>
  <Droppable droppableId="content">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {content.map((item, index) => (
          <Draggable key={item._id} draggableId={item._id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="p-3 mb-3 border rounded shadow-sm"
                style={{ ...provided.draggableProps.style, borderRadius: '8px' }}>
                <CRow>
                  <CCol md={12}>
                    {item.type === 'title' && <h3>{item.title}</h3>}
                    {item.type === 'subtitle' && <h4>{item.subtitle}</h4>}
                    {item.type === 'description' && <p>{item.description}</p>}
                    {item.type === 'image' && (
                    <div 
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        style={{
                          maxWidth: '100%', // Image will not exceed the container's width
                          maxHeight: '100%', // Image will not exceed the container's height
                          width: '600px',    // Default width for larger screens
                          height: 'auto',    // Maintain aspect ratio
                        }}
                      />
                    </div>
                  )}

{item.type === 'codeSnippet' && (
  <div style={{
    background: '#1e1e1e',
    color: '#d4d4d4',
    padding: '15px',
    borderRadius: '5px',
    overflowX: 'auto',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    position: 'relative'
  }}>
    <pre style={{ margin: 0 }}>
      <code>
        {item.code}
      </code>
    </pre>
    <CIcon
      icon={typingStates[item._id]?.isTyping ? cilMediaStop : cilMediaPlay}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        color: '#d4d4d4'
      }}
      onClick={() => {
        if (typingStates[item._id]?.isTyping) {
          stopTyping(item._id);
        } else {
          typeResults(item._id, item.codeResults);
        }
      }}
    />
    {typingStates[item._id]?.showResults && (
      <div style={{
        background: '#f5f5f5',
        color: '#333',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '10px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap'
      }}>
        <pre style={{ margin: 0 }}>
          <code>
            {typingStates[item._id]?.typedResults}
          </code>
        </pre>
      </div>
    )}
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
                      {/* Note Icon */}
                  
                  
                      {/* Note Content */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',    // Stack the title and content vertically
                        justifyContent: 'flex-start',
                        width: '100%'               // Make the content take the remaining width
                      }}>
                        {/* Note Title */}
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
                        }}>
                          {item.note}
                        </div>
                      </div>
                    </div>
                  )}
                    {item.type === 'list' && <ul><li>{item.item}</li></ul>}
                  </CCol>
                  <CCol md={12} className="text-center justify-content-center">
                    <CDropdown variant="" alignment="center">
                      <CDropdownToggle color="link" width={50} variant="transparent" caret={false}>
                        <CIcon icon={cilOptions} style={{ cursor: 'pointer', transform: 'rotate(90deg)' }} />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem onClick={() => {
                          if (item.type === 'title') handleEditContent(item);
                          if (item.type === 'subtitle') handleEditSubtitle(item);
                          if (item.type === 'description') handleEditDescription(item);
                          if (item.type === 'image') handleEditImage(item);
                          if (item.type === 'codeSnippet') handleEditCodeSnippet(item);
                          if (item.type === 'note') handleEditNote(item);
                          if (item.type === 'list') handleEditList(item);
                        }}>Edit</CDropdownItem>
<CDropdownItem onClick={() => navigate(`/DefaultLayout/popup/${item._id}`)}>Add Popup</CDropdownItem>                        <CDropdownItem onClick={() => handleDeleteContent(item._id, item.type)}>Delete</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CCol>
                </CRow>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
      </CCol>

      {/* Modal for Title */}
      <CModal visible={visible} onClose={resetForm}>
        <CModalHeader onClose={resetForm}>
          <CModalTitle>{isEditing ? 'Edit Title' : 'Add Title'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput
            placeholder='Title'
              type="text"
              id="title"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={resetForm}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleSaveContent(isEditing, editingId, newContent, updateContent, resetForm,chapter)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Subtitle */}
      <CModal visible={subtitleVisible} onClose={resetForm}>
        <CModalHeader onClose={resetForm}>
          <CModalTitle>{isSubtitleEditing ? 'Edit Subtitle' : 'Add Subtitle'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="subtitle">Subtitle</CFormLabel>
            <CFormInput
            placeholder='subtitle'

              type="text"
              id="subtitle"
              value={newSubtitle.subtitle}
              onChange={(e) => setNewSubtitle({ ...newSubtitle, subtitle: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={resetForm}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleSaveSubtitle(isSubtitleEditing, editingId, newSubtitle, updateContent, resetForm, chapter)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Description */}
      <CModal visible={descriptionVisible} onClose={resetForm}>
        <CModalHeader onClose={resetForm}>
          <CModalTitle>{isDescriptionEditing ? 'Edit Description' : 'Add Description'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              placeholder='description'


              type="text"
              id="description"
              value={newDescription.description}
              onChange={(e) => setNewDescription({ ...newDescription, description: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={resetForm}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleSaveDescription(isDescriptionEditing, editingId, newDescription, updateContent, resetForm, chapter)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Image */}
      <CModal visible={imageVisible} onClose={resetForm}>
        <CModalHeader onClose={resetForm}>
          <CModalTitle>{isImageEditing ? 'Edit Image' : 'Add Image'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="src">Image URL</CFormLabel>
            <CFormInput
              placeholder='URL'
              type="text"
              id="src"
              value={newImage.src}
              onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
            />
            <CFormLabel htmlFor="alt">Image Alt Text</CFormLabel>
            <CFormInput
              placeholder='alt'
              type="text"
              id="alt"
              value={newImage.alt}
              onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={resetForm}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleSaveImage(isImageEditing, editingId, newImage, updateContent, resetForm, chapter)}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      
{/* Modal for Code Snippet */}
<CModal visible={codeSnippetVisible} onClose={resetForm}>
  <CModalHeader onClose={resetForm}>
    <CModalTitle>{isCodeSnippetEditing ? 'Edit Code Snippet' : 'Add Code Snippet'}</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm>
  <CFormLabel htmlFor="code">Code</CFormLabel>
  <textarea
    id="code"
    value={newCodeSnippet.code}
    onChange={(e) => setNewCodeSnippet({ ...newCodeSnippet, code: e.target.value })}
    style={{
      width: '100%',
      height: '200px',
      background: '#1e1e1e',
      color: '#d4d4d4',
      padding: '15px',
      borderRadius: '5px',
      overflowX: 'auto',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap'
    }}
  />
  <CFormLabel htmlFor="syntaxLanguage">Syntax Language</CFormLabel>
  <CFormInput
    type="text"
    id="syntaxLanguage"
    value={newCodeSnippet.syntaxLanguage}
    onChange={(e) => setNewCodeSnippet({ ...newCodeSnippet, syntaxLanguage: e.target.value })}
  />
  <CFormLabel htmlFor="codeResults">Code Results</CFormLabel>
      <CFormTextarea
        id="codeResults"
        value={newCodeSnippet.codeResults}
        onChange={(e) => setNewCodeSnippet({ ...newCodeSnippet, codeResults: e.target.value })}
        style={{
          width: '100%',
          height: '100px',
          background: '#f5f5f5',
          color: '#333',
          padding: '15px',
          borderRadius: '5px',
          overflowX: 'auto',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}
      />
</CForm>
  </CModalBody>
  <CModalFooter>
    <CButton color="primary" onClick={resetForm}>
      Close
    </CButton>
    <CButton color="primary" onClick={() => handleSaveCodeSnippet(isCodeSnippetEditing, editingId, newCodeSnippet, updateContent, resetForm, chapter)}>
      Save
    </CButton>
  </CModalFooter>
</CModal>

{/* Modal for Note */}
<CModal visible={noteVisible} onClose={resetForm}>
  <CModalHeader onClose={resetForm}>
    <CModalTitle>{isNoteEditing ? 'Edit Note' : 'Add Note'}</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm>
      <CFormLabel htmlFor="note">Note</CFormLabel>
      <CFormTextarea
                    placeholder='Add Note'

        type="textarea"
        id="note"
        value={newNote.note}
        onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
      />
    </CForm>
  </CModalBody>
  <CModalFooter>
    <CButton color="primary" onClick={resetForm}>
      Close
    </CButton>
    <CButton color="primary" onClick={() => handleSaveNote(isNoteEditing, editingId, newNote, updateContent, resetForm, chapter)}>
      Save
    </CButton>
  </CModalFooter>
</CModal>

{/* Modal for List */}
<CModal visible={listVisible} onClose={resetForm}>
  <CModalHeader onClose={resetForm}>
    <CModalTitle>{isListEditing ? 'Edit List' : 'Add List'}</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm>
      <CFormLabel htmlFor="item">List Item</CFormLabel>
      <CFormTextarea
        type="text"
        placeholder='Add Note'

        id="item"
        value={newList.item}
        onChange={(e) => setNewList({ ...newList, item: e.target.value })}
      />
    </CForm>
  </CModalBody>
  <CModalFooter>
    <CButton color="primary" onClick={resetForm}>
      Close
    </CButton>
    <CButton color="primary" onClick={() => handleSaveList(isListEditing, editingId, newList, updateContent, resetForm, chapter)}>
      Save
    </CButton>
  </CModalFooter>
</CModal>

    </CRow>
  );
};
export default Contentchapter;