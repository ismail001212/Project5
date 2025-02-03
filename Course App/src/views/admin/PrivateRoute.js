import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [jwtDecode, setJwtDecode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null); // State for handling redirection
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

  // Logout function
  const handleLogout = async () => {
    try {
      // Clear localStorage and update backend
      setUserData((prevData) => ({ ...prevData, Actif: false }));
      localStorage.removeItem('token');
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/login'); // Redirect to login
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  // Token expiration and daily logout logic
  useEffect(() => {
    if (!token || !jwtDecode) return;
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error('Invalid token. Redirecting to login.');
      localStorage.removeItem('token');
      handleLogout();
      return;
    }

    const currentTime = Date.now() / 1000; 
    const dailyLogoutTime = 24 * 60 * 60; 

    // Set interval for daily logout
    const interval = setInterval(() => {
      const currentTime = Date.now() / 1000;
      const timeRemaining = decoded.exp - currentTime;

      if (timeRemaining <= 0) {
        console.warn('Token expired. Logging out now.');
        clearInterval(interval); // Clear interval to prevent memory leaks
        handleLogout();
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.warn('Logging out for the day...');
        handleLogout();
        localStorage.removeItem('token');
        navigate('/login');
      }
    }, dailyLogoutTime * 1000); // Repeat every 24 hours

    // Cleanup interval on component unmount
    return () => clearInterval(interval);

    if (decoded.exp < currentTime) {
      console.warn('Token expired. Logging out now.');
      handleLogout();
      localStorage.removeItem('token');
    }
  }, [token, jwtDecode, navigate]);

  // Fetch user data
  useEffect(() => {
    if (!token || !jwtDecode) return;

    const fetchUserData = async () => {
      try {
        const decoded = jwtDecode(token);

        if (!decoded.id) {
          console.error('User ID not found in token.');
          setRedirectPath('/login');
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/auth/user/${decoded.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData);

        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTimestamp = Math.floor(
          new Date(userData.expiration_date).getTime() / 1000
        );

        if (expirationTimestamp < currentTime) {
          console.warn('Token expired.');
          setRedirectPath('/login');
          return;
        }

        if (userData.status === 'waiting') {
          console.warn('Account is waiting for approval.');
          setRedirectPath('/login');
          return;
        }

        if (userData.status === 'rejected') {
          console.warn('Account rejected.');
          setRedirectPath('/rejected');
          return;
        }

        if (!['admin', 'Advanced_user'].includes(userData.role)) {
          console.warn('Unauthorized access.');
          setRedirectPath('/login');
          return;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setRedirectPath('/login');
      }
    };

    fetchUserData();
  }, [token, jwtDecode]);

  // Redirect logic
  useEffect(() => {
    if (redirectPath) {
      handleLogout(); // Ensure cleanup
    }
  }, [redirectPath]);

  // Loading state
  if (loading || userData === null) {
    return <div>Loading...</div>;
  }

  // Redirect if needed
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children for authorized users
  return children;
};

export default PrivateRoute;
