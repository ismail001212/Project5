import React from 'react';
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass } from '@coreui/icons';

const Page404 = () => {
  return (
    <div className=" min-vh-100 d-flex flex-column align-items-center justify-content-center text-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <h4 className="pt-3 fw-semibold">Oops! You{"'"}re lost.</h4>
            <p className="">
              The page you are looking for doesn't exist or has been moved.
            </p>
       
            <CButton
              color="secondary"
              onClick={() => window.location.href = '/'}
              className="mt-3"
            >
              Back to Home
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Page404;
