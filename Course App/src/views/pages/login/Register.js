import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import countryData from 'world-countries'; // Use a library or custom country data
import PhoneInput from 'react-phone-number-input'; // Import phone number input library
import 'react-phone-number-input/style.css'; // Import the styles for phone input
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilPhone, cilUser } from '@coreui/icons';
import { Link } from 'react-router-dom';

const countries = countryData.map((country) => ({
  label: (
    <span>
      <img
        src={`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`}
        alt={country.name.common}
        style={{ width: 20, marginRight: 10 }}
      />
      {country.name.common}
    </span>
  ),
  value: country.cca2, // Use country code (cca2) for phone number formatting
}));

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    country: countries[0]?.value || '', // Default to the first country
    email: '',
    password: '',
    repeatPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Set the default country based on geolocation
  useEffect(() => {
    const getCountryFromLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // You can use an external service like ipstack or ip-api to get country from geolocation
            try {
              const response = await axios.get(
                `https://api.ipapi.com/${latitude},${longitude}?access_key=YOUR_ACCESS_KEY`
              );
              const countryCode = response.data.country_code; // Returns the country code (e.g., 'US')
              const defaultCountry = countryCode ? countryCode.toLowerCase() : 'us'; // Default to 'us' if not found
              setFormData((prev) => ({
                ...prev,
                country: defaultCountry,
              }));
            } catch (error) {
              console.error('Error detecting country', error);
            }
          },
          (error) => {
            console.error('Error getting geolocation', error);
          }
        );
      }
    };
    getCountryFromLocation();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle country change (for phone number country code)
  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, country: selectedOption.value }));
  };

  // Handle phone number change
  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullname: formData.fullname,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      setSuccess('Account created successfully! Please verify your email.');
      setError('');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create account');
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email: formData.email,
      });
      if (response.status === 200) {
        setSuccess('Verification email sent again. Please check your inbox.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to resend verification email');
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="shadow-lg rounded-lg">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1 className="text-center mb-4">Register</h1>
                  <p className="text-muted text-center mb-4">Create your account</p>

                  {/* Fullname */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="fullname"
                      placeholder="Full Name"
                      autoComplete="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  {/* Phone with country code */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <PhoneInput
                      international
                      name="phone"
                      placeholder="Phone"
                      autoComplete="phone"
                      defaultCountry={formData.country}
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="form-control"
                      required
                    />
                  </CInputGroup>

                  {/* Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      type="email"
                    />
                  </CInputGroup>

                  {/* Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  {/* Repeat Password */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="repeatPassword"
                      placeholder="Repeat Password"
                      autoComplete="new-password"
                      value={formData.repeatPassword}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  {/* Error and Success Messages */}
                  {error && <p className="text-danger text-center">{error}</p>}
                  {success && (
                    <div>
                      <p className="text-success text-center">{success}</p>
                      <div className="text-center m-3">
                        <p className="d-grid mt-3 text-primary text-center" onClick={handleResendVerification}>
                          Resend Email Verification
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="d-grid">
                    <CButton color="primary" type="submit" disabled={loading}>
                      {loading ? <CSpinner size="sm" /> : 'Create Account'}
                    </CButton>
                  </div>

                  {/* Link to Login */}
                  <Link to="/login">
                    <p className="d-grid mt-3 text-primary text-center">Already have an account? Login</p>
                  </Link>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
