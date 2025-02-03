import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AppSidebarNav } from './AppSidebarNav';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const { course_Id } = useParams();
  const navigate = useNavigate();
  const [navigation, setNavigation] = useState([]);
  const {chapter_id} = useParams();


  const fetchChapters = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/chapters/course/${course_Id}`
      );
  
      const chapters = response.data.map((chapter) => ({
        component: 'div', // Default to div for navigation items
        _id: chapter._id,
        name: chapter.title,
        to: `/course/${course_Id}/chapter/${chapter._id}`,
      }));
  
      setNavigation(chapters);
  
      if (chapters.length === 0) {
        console.warn("No chapters available for this course.");
        return;
      }
  
      const selectedChapterId = localStorage.getItem("SelectedChapter");
  
      // 1. If chapter_id is undefined, navigate to the first chapter
      if (!chapter_id) {
        navigate(`/course/${course_Id}/chapter/${chapters[0]._id}`);
        localStorage.setItem("SelectedChapter", chapters[0]._id);
      }
      // 2. If there's no valid localStorage entry, fallback to the first chapter
      else if (!selectedChapterId || !chapters.some(ch => ch._id === selectedChapterId)) {
        navigate(`/course/${course_Id}/chapter/${chapters[0]._id}`);
        localStorage.setItem("SelectedChapter", chapters[0]._id);
      }
      // 3. If chapter_id is valid, navigate to it
      else {
        navigate(`/course/${course_Id}/chapter/${chapter_id}`);
        localStorage.setItem("SelectedChapter", chapter_id);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setNavigation([]); // Clear navigation on error
    }
  }, [course_Id, navigate, chapter_id]);
  
  useEffect(() => {
    if (course_Id) {
      fetchChapters();
    }
  }, [course_Id, fetchChapters]);

  return (
    <CSidebar
      className="border-end"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <img
            src="/path/to/your/full-logo.png"
            alt="Logo"
            className="sidebar-brand-full"
            height={32}
          />
          <img
            src="/path/to/your/narrow-logo.png"
            alt="Narrow Logo"
            className="sidebar-brand-narrow"
            height={32}
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
