import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CRow, CInputGroup, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeOpen } from '@coreui/icons'; // Importing an envelope icon

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(response.data.message); // Success message
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send password reset link.');
      setLoading(false);
    }
  };

  return (
    <CContainer fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <CRow className="w-100">
        <CCol md={6} className="mx-auto">
          <CCardGroup>
            <CCard className="shadow-lg p-4 rounded">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1 className="mb-4 text-center" style={{ color: '#343a40' }}>Forgot Password</h1>
                  <p className="text-muted mb-4 text-center">Enter your email address to receive a password reset link.</p>

                  {/* Email Input with Icon */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeOpen} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleChange}
                      required
                      aria-label="Email address"
                      className="input-field"
                    />
                  </CInputGroup>

                  {/* Error or Success Message */}
                  {error && <p className="text-danger text-center">{error}</p>}
                  {message && <p className="text-success text-center">{message}</p>}

                  {/* Submit Button */}
                  <CRow>
                    <CCol xs={12}>
                      <CButton 
                        type="submit" 
                        color="primary" 
                        className="w-100" 
                        disabled={loading}
                        style={{
                          transition: 'background-color 0.3s ease, transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </CButton>
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

export default ForgotPassword;
