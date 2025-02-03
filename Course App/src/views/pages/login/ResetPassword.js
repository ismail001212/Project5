import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CRow, CInputGroup, CInputGroupText, CLink } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons';

const ResetPassword = () => {
  const { token } = useParams(); // Token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token is valid when the component loads
    if (!token) {
      setError('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message); // Success message
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
      setLoading(false);
    }
  };

  return (
    <CContainer fluid className="min-vh-100 d-flex align-items-center justify-content-center">
      <CRow className="w-100">
        <CCol md={6} className="mx-auto">
          <CCardGroup>
            <CCard className="p-4 shadow-lg rounded">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1 className="mb-4 text-center">Reset Password</h1>
                  <p className="text-body-secondary mb-4 text-center">Enter your new password below.</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-label="New password"
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockUnlocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      aria-label="Confirm new password"
                    />
                  </CInputGroup>

                  {error && <p className="text-danger text-center">{error}</p>}
                  {message && <p className="text-success text-center">{message}</p>}

                  <CRow>
                    <CCol xs={12}>
                      <CButton type="submit" color="primary" className="w-100" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </CButton>
                    </CCol>
                  </CRow>

                  {/* Login Link */}
                  <CRow className="mt-3">
                    <CCol xs={12} className="text-center">
                      <p>Remembered your password? <CLink href="/login" color="primary">Go to Login</CLink></p>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ResetPassword;
