import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  CCardImage,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormTextarea,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilOptions, cilPlus } from '@coreui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

const ChapterPage = () => {
  const [chapters, setChapters] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('selectedLanguage') || 'English');
  const [editingChapter, setEditingChapter] = useState(null);

  const [course, setCourse] = useState({
    _id: '',
    title: 'Course Name',
    description: 'This is a description of the course.',
    courseimage: 'https://via.placeholder.com/300x200',
  });

  const [newChapter, setNewChapter] = useState({
    title: '',
    description: '',
    course: '',
    index: 1,
    language: currentLanguage,
  });

  // Fetch Course & Chapters
  useEffect(() => {
    const selectedCourse = localStorage.getItem('selectedCourse');
    if (selectedCourse) {
      const courseData = JSON.parse(selectedCourse);
      setCourse(courseData);
      fetchChapters(courseData._id);
    }
  }, []);

  const fetchChapters = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/chapters/course/${courseId}`);
      setChapters(response.data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  // Add Chapter Modal
  const handleAddChapter = () => {
    setIsEditing(false);
    setNewChapter({
      title: '',
      description: '',
      course: course._id,
      index: chapters.length ,
      language: currentLanguage,
    });
    setVisible(true);
  };

  // Edit Chapter Modal
  const handleEditChapter = (chapter) => {
    setIsEditing(true);
    setNewChapter({
      title: chapter.title,
      description: chapter.description,
      course: chapter.course,
      index: chapter.index,
      language: chapter.language,
    });
    setEditingChapter(chapter._id);
    setVisible(true);
  };

  // Save Chapter (Add or Edit)
  const handleSaveChapter = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/auth/chapters/${editingChapter}`, newChapter);
      } else {
        await axios.post('http://localhost:5000/api/auth/chapters', {
          ...newChapter,
          course: course._id,
          language: currentLanguage,
        });
      }
      fetchChapters(course._id);
      resetForm();
    } catch (error) {
      console.error('Error saving chapter:', error);
    }
  };

  // Reset Modal Form
  const resetForm = () => {
    setVisible(false);
    setNewChapter({
      title: '',
      description: '',
      course: '',
      index: chapters.length,
      language: currentLanguage,
    });
    setIsEditing(false);
    setEditingChapter(null);
  };

  // Handle Drag-and-Drop
  const handleOnDragEnd = async (result) => {
    if (!result.destination) return; // If no destination, do nothing

    const reorderedChapters = Array.from(chapters); // Clone the current chapters array
    const [removed] = reorderedChapters.splice(result.source.index, 1); // Remove the dragged chapter
    reorderedChapters.splice(result.destination.index, 0, removed); // Insert the dragged chapter into the new position

    const finalOrder = reorderedChapters.map((chapter, index) => ({
      id: chapter._id,  // The unique identifier of the chapter
      index: index,     // The new index after reordering
    }));

    try {
      const response = await axios.put('http://localhost:5000/api/auth/chapters/reorder', {
        order: finalOrder,  // Send the updated order with new indexes
      });

      const updatedChapters = reorderedChapters.map((chapter, index) => ({
        ...chapter,
        index: index,  // Assign the new index values to the chapters
      }));
      setChapters(updatedChapters);  // Update the chapters state

      console.log('Chapters reordered successfully:', response.data);
    } catch (error) {
      console.error('Error reordering chapters:', error.response?.data || error.message);
    }
  };

  // Handle Delete Chapter
  const handleDeleteChapter = async (chapterId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/chapters/${chapterId}`);
      const updatedChapters = chapters.filter((chapter) => chapter._id !== chapterId);

      const reorderedChapters = updatedChapters.map((chapter, index) => ({
        ...chapter,
        index: index,  // Update the index to reflect the new position
      }));

      const finalOrder = reorderedChapters.map((chapter) => ({
        id: chapter._id,
        index: chapter.index,
      }));

      await axios.put('http://localhost:5000/api/auth/chapters/reorder', {
        order: finalOrder,  // Send the updated order with new indexes
      });

      setChapters(reorderedChapters);

      console.log('Chapter deleted and order updated successfully');
    } catch (error) {
      console.error('Error deleting chapter:', error.response?.data || error.message);
    }
  };
    const navigate = useNavigate();
  
 
  const handleNavigate = (chapter) => {
    localStorage.setItem('selectedChapter', JSON.stringify(chapter));

    navigate('/DefaultLayout/content');
  };
  return (
    <CRow>
      <CCol xs={12}>
        {/* Course Section */}
        <CCard className="shadow-lg mb-4">
          <CCardBody>
            <CRow>
            <CCol md={4} className="d-flex justify-content-center align-items-center">
            <CCardImage
                src={`http://localhost:5000/uploads/${course.courseimage}`}
                alt="Course"
                className="mb-3 rounded"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            </CCol>
              <CCol md={8}>
                <h3 className="text-primary">{course.title}</h3>
                <p>{course.description}</p>
                <CButton color="primary" onClick={handleAddChapter} className="mt-3">
                  <CIcon icon={cilPlus} /> Add Chapter
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* Chapters Section */}
        <CCard className="shadow-lg border-0">
          <CCardBody>
            <h4 className="mb-4 ">Chapters</h4>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="chapters">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ maxHeight: '400px', overflowY: 'auto' }}
                  >
                    {chapters.map((chapter, index) => (
                      <Draggable key={chapter._id} draggableId={chapter._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 mb-3 border rounded shadow-sm"
                            style={{ ...provided.draggableProps.style, borderRadius: '8px' }}
                          >
                            <CRow>
                              <CCol>
                                <strong>{chapter.title}</strong><br />
                                <small className="text-muted">{chapter.description}</small>
                              </CCol>
                              <CCol className="text-end">
                                <CDropdown variant="" alignment="end">
                                  <CDropdownToggle color="link" variant="transparent" caret={false}>
                                    <CIcon icon={cilOptions} style={{ cursor: 'pointer' }} />
                                  </CDropdownToggle>
                                  <CDropdownMenu>
                                    <CDropdownItem onClick={() => handleEditChapter(chapter)}>Edit</CDropdownItem>
                                    <CDropdownItem onClick={() => handleNavigate(chapter)}>Details</CDropdownItem>
                                    <CDropdownItem onClick={() => handleDeleteChapter(chapter._id)}>Delete</CDropdownItem>
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
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal */}
      <CModal visible={visible} onClose={resetForm} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>{isEditing ? 'Edit Chapter' : 'Add Chapter'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel className="">Title</CFormLabel>
            <CFormInput
            placeholder='Title'
            value={newChapter.title}
            onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
            className="mb-3"/>
            <CFormLabel className="">Description</CFormLabel>
            <CFormTextarea
            placeholder='Description'
              value={newChapter.description}
              onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetForm}>Cancel</CButton>
          <CButton color="primary" onClick={handleSaveChapter}>Save</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default ChapterPage;
