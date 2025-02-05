import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  
  cilSpeedometer,
  cilFolder,
  cilUser, 
  cilLanguage,
  cilList, 
  cilCheckCircle,
  cilXCircle,
  cilClock
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/DefaultLayout/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Courses',
    to: '/DefaultLayout/courses',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/DefaultLayout/categories',
    icon: <CIcon icon={cilFolder}  customClassName="nav-icon" />,
  },
  
 
  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accepted Users',  // Proper capitalization
        to: '/DefaultLayout/users/accepted',  // Correct route for accepted users
        icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Waiting Users',  // Proper capitalization
        to: '/DefaultLayout/users/waiting',  // Correct route for waiting users
        icon: <CIcon icon={cilClock} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Rejected Users',  // Correct spelling and capitalization
        to: '/DefaultLayout/users/rejected',  // Correct route for rejected users
        icon: <CIcon icon={cilXCircle} customClassName="nav-icon" />
      }
    ]
  }
  

]

export default _nav
