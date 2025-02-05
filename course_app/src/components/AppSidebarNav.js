import React, { useState, useEffect } from 'react';  // Import necessary hooks
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

import { CBadge, CNavLink, CSidebarNav, CNavItem, CNavGroup } from '@coreui/react';  // Ensure correct imports
import CIcon from '@coreui/icons-react';  // Make sure to import CIcon
import { cilSpeedometer, cilList, cilFolder, cilUser, cilCheckCircle, cilClock, cilXCircle } from '@coreui/icons';  // Add icon imports

export const AppSidebarNav = ({ items = [] }) => {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jwtDecode, setJwtDecode] = useState(null);

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
    const token = localStorage.getItem('token');
    let userRole = null;

    if (token && jwtDecode) {
      try {
        const decoded = jwtDecode(token);
        userRole = decoded.role; // Adjust this to your token's structure
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }

    let items = [];
    if (userRole == 'Advanced_user') {
      items = [
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
          icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
        },
      ];
    } else if (userRole == 'admin'){
      items = [
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
          icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
        },
        {
          component: CNavGroup,
          name: 'Users',
          icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'Accepted Users',
              to: '/DefaultLayout/users/accepted',
              icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Waiting Users',
              to: '/DefaultLayout/users/waiting',
              icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
            },
            {
              component: CNavItem,
              name: 'Rejected Users',
              to: '/DefaultLayout/users/rejected',
              icon: <CIcon icon={cilXCircle} customClassName="nav-icon" />,
            },
          ],
        },
      ];
    }

    setNavItems(items);
  }, [jwtDecode]);

  if (loading) {
    return null; // Optionally display a loading spinner
  }

  const navLink = (name, icon, badge, indent = false) => (
    <>
      {icon || (indent && (
        <span className="nav-icon">
          <span className="nav-icon-bullet"></span>
        </span>
      ))}
      {name && name}
      {badge && (
        <CBadge color={badge.color} className="ms-auto" size="sm">
          {badge.text}
        </CBadge>
      )}
    </>
  );

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: "_blank", rel: "noopener noreferrer" })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  const navGroup = (item, index) => {
    const { component, name, icon, items, ...rest } = item;
    const Component = component;
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true)
        )}
      </Component>
    );
  };

  // Check if items is actually an array before calling map
  if (!Array.isArray(items)) {
    console.error("Expected items to be an array, but got:", items);
    return null;
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {navItems.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.array,
};

export default AppSidebarNav;
