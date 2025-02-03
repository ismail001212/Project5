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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilOptions, cilPeople } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Pad single digit days
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit months
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const User = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedField, setSelectedField] = useState('fullname'); // Field to search by
  const [selectedRole, setSelectedRole] = useState('');
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: '',
    phone: '',
    email: '',
    role: '',
    status: '',
    expiration_date: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    if (!token) {
      console.error('No token found, please login');
      return;
    }

    // Fetching user data from API
    setLoading(true); // Start loading
    axios
      .get('http://localhost:5000/api/auth/user/rejected', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      })
      .then((response) => {
        setLoading(false); // End loading after data is fetched
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error('Fetched data is not an array:', response.data);
        }
      })
      .catch((error) => {
        setLoading(false); // End loading in case of error
        console.error('Error fetching user data:', error);
      });
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

   const [jwtDecode, setJwtDecode] = useState(null);
    const [userData, setUserData] = useState(null); // Store user data from backend
    const navigate = useNavigate();
  
    const token = localStorage.getItem('token');
  
    // Dynamically import jwt-decode
    useEffect(() => {
      import('jwt-decode')
        .then((module) => {
          setJwtDecode(() => module.default || module.jwtDecode || module);
        })
        .catch((err) => {
          console.error('Error loading jwt-decode:', err);
        })
        .finally(() => setLoading(false));
    }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !jwtDecode) return;

      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);

        if (!decoded.id) {
          console.error('User ID not found in token.');
          handleLogout();
          return;
        }

        const response = await fetch(`http://localhost:5000/api/auth/user/${decoded.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData); // Backend returns { status, role, Actif }
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
      }
    };

    fetchUserData();
  }, [token, jwtDecode]);
  useEffect(() => {
    if (userData) {
      if(userData.role=="Advanced_user"){
          navigate("/404")
      }
    } else {
      console.log('User data is not yet available.');
    }
  }, [userData]);

  // Filter data by role, search field, and search value
  const filteredData = data.filter((user) => {
    const searchValue = user[selectedField] ? user[selectedField].toString().toLowerCase() : '';
    return searchValue.includes(search.toLowerCase()) && (selectedRole === '' || user.role === selectedRole);
  });

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Form validation
  const validateForm = () => {
    if (!newUser.fullname || !newUser.phone || !newUser.email || !newUser.role) {
      alert('All fields must be filled!');
      return false;
    }
    return true;
  };

  // Handle Add or Edit user
  const handleSaveUser = () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for saving the user');
      return;
    }

    const url = isEditing
      ? `http://localhost:5000/api/auth/updateUserByEmail/${newUser.email}` // Update user by email
      : 'http://localhost:5000/api/auth/user'; // Create new user

    const method = 'POST'; // Using POST for both creation and updating

    const dataToSend = {
      ...newUser,
      expiration_date: newUser.expiration_date,
    };

    axios({
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token here
      },
      data: dataToSend, // Send data with the request
    })
      .then((response) => {
        console.log('User saved successfully:', response.data);
        if (isEditing) {
          // Update the data list with the updated user information
          const updatedData = data.map((user) =>
            user.email === newUser.email ? { ...newUser } : user // Match user by email for update
          );
          setData(updatedData);
        } else {
          setData([...data, newUser]); // Add the new user to the list
        }
        resetForm(); // Reset the form after save
      })
      .catch((error) => {
        console.error('Error saving user:', error);
      });
  };

  const handleEdit = (user) => {
    setNewUser({
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
      expiration_date: user.expiration_date ? user.expiration_date.split('T')[0] : '',
    });
    setIsEditing(true);
    setVisible(true);
  };

  const handleDelete = (email) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for deleting the user');
      return;
    }

    axios
      .delete(`http://localhost:5000/api/auth/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setData(data.filter((user) => user.email !== email));
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const resetForm = () => {
    setVisible(false);
    setNewUser({ fullname: '', phone: '', email: '', role: '', status: '', expiration_date: '' });
    setIsEditing(false);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardBody>
            {/* Search bar */}
            <div className="d-flex justify-content-between mb-3">
              {/* Search Criteria Dropdown */}
              <CFormInput
                type="search"
                placeholder={`Search by ${selectedField}...`}
                className="w-25"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<CIcon icon={cilSearch} />}
              />
              <CFormSelect
                className="w-25"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
              >
                <option value="fullname">Fullname</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </CFormSelect>

              {/* Search Input */}
              

              {/* Role Filter Dropdown */}
              <CFormSelect
                className="w-25"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="Advanced_user">Advanced user</option>
              </CFormSelect>
            </div>

            <CTable align="middle" className="mb-0" hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">
                    <CIcon icon={cilPeople} />
                  </CTableHeaderCell>
                  <CTableHeaderCell>Fullname</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Phone</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Role</CTableHeaderCell>
                  <CTableHeaderCell>date .inscription</CTableHeaderCell>
                  <CTableHeaderCell>expiration date</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  currentItems.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">
                        <CIcon icon={cilPeople} />
                      </CTableDataCell>
                      <CTableDataCell>{user.fullname}</CTableDataCell>
                      <CTableDataCell className="text-center">{user.phone}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.role}</CTableDataCell>
                      <CTableDataCell>{user.createdAt && formatDate(user.createdAt)}</CTableDataCell>
                      <CTableDataCell>{user.expiration_date && formatDate(user.expiration_date)}</CTableDataCell>
                      <CTableDataCell>
                        <CDropdown variant="" alignment="end">
                          <CDropdownToggle color="" variant="" caret={false}>
                            <CIcon icon={cilOptions} style={{ cursor: 'pointer' }} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem onClick={() => handleEdit(user)}>Edit</CDropdownItem>
                            <CDropdownItem onClick={() => handleDelete(user.email)}>Delete</CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>

          {/* Pagination */}
          <CCol xs={12} className="d-flex justify-content-center">
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
          </CCol>
        </CCard>
      </CCol>

      {/* Edit User Modal */}
      <CModal visible={visible} onClose={resetForm}>
        <CModalHeader>
          <CModalTitle>{isEditing ? 'Edit User' : 'View User'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Fullname</CFormLabel>
            <CFormInput
              value={newUser.fullname}
              disabled={!isEditing}
              onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
            />
            <CFormLabel>Phone</CFormLabel>
            <CFormInput
              value={newUser.phone}
              disabled={!isEditing}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <CFormLabel>Email</CFormLabel>
            <CFormInput value={newUser.email} disabled={true} />
            <CFormLabel>Role</CFormLabel>
            <CFormSelect
              value={newUser.role}
              disabled={!isEditing}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="Advanced_user">Advanced user</option>
            </CFormSelect>
            <CFormLabel>Status</CFormLabel>
            <CFormSelect
              value={newUser.status}
              disabled={!isEditing}
              onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
            >
              <option value="waiting">Waiting</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </CFormSelect>

            <CFormLabel>Expiration Date</CFormLabel>
            <CFormInput
              type="date"
              value={newUser.expiration_date ? newUser.expiration_date.split('T')[0] : ''}
              disabled={!isEditing}
              onChange={(e) => setNewUser({ ...newUser, expiration_date: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={resetForm}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveUser} disabled={!isEditing}>
            {isEditing ? 'Update User' : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default User;
