import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import axios from 'axios';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
} from '@coreui/react';
import './EnglishPage.css';
import { AppFooter, APPheaderdocs, AppHeaderuser } from '../../../components';
import AppSidebar from './sidebare';
import Contentchapter from './ChapterContent';

const Docs = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
const selectedchapter=localStorage.getItem("selectedChapter")



 return (
    <div>
    <AppSidebar />
    <div className="wrapper d-flex flex-column min-vh-100">
    <APPheaderdocs selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
    <div className="body flex-grow-1 m-5">
        <Contentchapter/>
    </div>
    <AppFooter/>
    </div>
  </div>
  );
};

export default Docs;
