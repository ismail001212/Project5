import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CButton, CCard, CCardBody, CContainer, CRow, CCol, CSpinner } from '@coreui/react'; // CoreUI for styling

const VerifyEmail = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending'); // can be 'success', 'error', or 'pending'
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();  // to read URL parameters

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Invalid verification link');
        setStatus('error');
        setLoading(false);
        return;
      }

      try {
        await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        setMessage('Email verified successfully! Redirecting to login...');
        setStatus('success');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      } catch (error) {
        setMessage('Failed to verify email. Please try again.');
        setStatus('error');
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <CContainer fluid className="min-vh-100 d-flex justify-content-center align-items-center">
      <CRow className="w-100">
        <CCol md={6} className="mx-auto">
          <CCard className="shadow-lg p-5 text-center">
            <CCardBody>
              {loading ? (
                <>
                  <CSpinner color="primary" size="lg" />
                  <h3 className="mt-4 text-muted">Verifying...</h3>
                </>
              ) : (
                <>
                  {status === 'success' && (
                    <h2 className="mb-4" style={{ color: '#4BB543' }}>
                      <i className="fas fa-check-circle" style={{ fontSize: '50px', color: '#4BB543' }}></i>
                    </h2>
                  )}
                  {status === 'error' && (
                    <h2 className="mb-4" style={{ color: '#e74c3c' }}>
                      <i className="fas fa-times-circle" style={{ fontSize: '50px', color: '#e74c3c' }}></i>
                    </h2>
                  )}
                  <h3>{message}</h3>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default VerifyEmail;
