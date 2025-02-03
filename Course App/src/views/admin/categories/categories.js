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
  CPagination,
  CPaginationItem,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CFormText,
  CFormTextarea,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilOptions, cilLayers, cilPlus } from '@coreui/icons';
import './style.css';
 
const Category = () => {const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('name');
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    language: '',
    categoryImage: '',
  });
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);

  const itemsPerPage = 10;

  // Get language from local storage
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'English';

  useEffect(() => {
    fetchCategories();
  }, [currentLanguage]);

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

  // Pagination logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredCategories = categories.filter((category) =>
    category[selectedSearchField]?.toLowerCase().includes(search.toLowerCase())
  );

  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const handleSaveCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        alert('Please provide a category name.');
        return;
      }

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', newCategory.name.trim());
      formData.append('description', newCategory.description.trim());
      formData.append('language', newCategory.language || currentLanguage);
      if (categoryImageFile) {
        formData.append('categoryImage', categoryImageFile);
      }

      const url = isEditing
        ? `http://localhost:5000/api/auth/categories/${newCategory._id}`
        : 'http://localhost:5000/api/auth/categories';
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

      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddCategory = () => {
    setIsEditing(false);
    setNewCategory({ name: '', description: '', language: currentLanguage, categoryImage: '' });
    setCategoryImageFile(null);
    setVisible(true);
  };

  const resetForm = () => {
    setVisible(false);
    setNewCategory({ name: '', description: '', language: '', categoryImage: '' });
    setCategoryImageFile(null);
    setIsEditing(false);
  };

  // Handle category details
  const handledetails = (category) => {
    setCategoryDetails(category);
  };
  const handleEdit = (category) => {
    setNewCategory(category);
    setCategoryImageFile(null);
    setIsEditing(true);
    setVisible(true);
  };
  const handleDelete = (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');

    if (confirmDelete) {
      const token = localStorage.getItem('token');

      // Make the delete request to your API
      axios
        .delete(`http://localhost:5000/api/auth/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          // Successfully deleted the course, refresh the courses list
          fetchCategories();
          alert('category deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete the category.');
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
                <option value="name">Name</option>
                <option value="description">Description</option>
              </CFormSelect>
              <CButton color="primary" onClick={handleAddCategory}>
                <CIcon icon={cilPlus} /> Add Category
              </CButton>
            </div>

            <CTable align="middle" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">
                    <CIcon icon={cilLayers} />
                  </CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>language</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.map((category) => (
                  <CTableRow key={category._id}>
                    <CTableDataCell className="text-center">
                      <CIcon icon={cilLayers} />
                    </CTableDataCell>
                    <CTableDataCell>{category.name}</CTableDataCell>
                    <CTableDataCell> 
                          {category.description.length > 40 
                          ? `${category.description.slice(0, 40)}...` 
                          : category.description}
                    </CTableDataCell>
                    <CTableDataCell>{category.language}</CTableDataCell>

                    <CTableDataCell>
                      <CDropdown variant="" alignment="end">
                        <CDropdownToggle color="" variant="" caret={false}>
                          <CIcon icon={cilOptions} style={{ cursor: 'pointer' }} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => handleEdit(category)}>Edit</CDropdownItem>
                          <CDropdownItem onClick={() => handledetails(category)}>Details</CDropdownItem>
                          <CDropdownItem onClick={() => handleDelete(category._id)}>Delete</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <CPagination>
              {[...Array(totalPages)].map((_, idx) => (
                <CPaginationItem
                  key={idx}
                  active={idx + 1 === currentPage}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Add/Edit Category Modal */}
      <CModal visible={visible} onClose={resetForm}>
        <CModalHeader>
          <CModalTitle>{isEditing ? 'Edit Category' : 'Add Category'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Name</CFormLabel>
            <CFormInput
            placeholder='Name'
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <CFormLabel>Description</CFormLabel>
            <CFormTextarea
            placeholder='Description'

              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            />
            <CFormLabel>Image</CFormLabel>
            <CFormInput
              type="file"
              onChange={(e) => setCategoryImageFile(e.target.files[0])}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetForm}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveCategory}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={categoryDetails !== null} onClose={() => setCategoryDetails(null)}>
  <CModalHeader>
    <CModalTitle>Category Details</CModalTitle>
  </CModalHeader>
  <CModalBody>
    {categoryDetails && (
      <CCard className="border-0 shadow-sm">
        <CCardBody>
          {/* Image Section */}
          {categoryDetails.categoryImage && (
            <div className="text-center mb-4">
              <img
                src={`http://localhost:5000/uploads/${categoryDetails.categoryImage}`}
                alt={categoryDetails.name}
                width={100}
                className="d-block mx-auto"
              />
            </div>
          )}

          {/* Name Section */}
          <h5 className="text-primary text-center mb-3" style={{ fontWeight: 'bold' }}>
            {categoryDetails.name}
          </h5>

          {/* Description Section */}
          <p className="text-muted" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
            {categoryDetails.description}
          </p>
        </CCardBody>
      </CCard>
    )}
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" onClick={() => setCategoryDetails(null)}>
      Close
    </CButton>
  </CModalFooter>
</CModal>
    </CRow>
  );
};

export default Category;
