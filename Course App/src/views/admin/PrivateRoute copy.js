import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [jwtDecode, setJwtDecode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // Store user data from backend
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

  const handleLogout = async () => {
    try {
      // Update Actif status to false before logging out
      setUserData((prevData) => ({ ...prevData, Actif: false }));

      // Call backend to log out user and set Actif to false
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Remove token from local storage
      localStorage.removeItem('token');

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

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
const currentTime = Date.now() / 1000; // Current time in seconds
const timeUntilExpiration = decoded.exp - currentTime; // Time until expiration in seconds

const dailyLogoutTime = 24 * 60 * 60; // 1 day in seconds

const interval = setInterval(() => {
  const currentTime = Date.now() / 1000; 
  const timeRemaining = decoded.exp - currentTime; 

  if (timeRemaining <= 0) {
    console.warn('Token expired. Logging out now.');
    clearInterval(interval); 
    handleLogout();
    localStorage.removeItem('token');
    navigate('/login');
  } else {
    console.warn('Logging out for the day...');
    handleLogout();
    localStorage.removeItem('token');
    navigate('/login');
  }
}, dailyLogoutTime * 1000); 

return () => clearInterval(interval);


    if (decoded.exp < currentTime) {
      console.warn('Token expired. Logging out now.');
      handleLogout();
      localStorage.removeItem('token');
    }
  }, [token, jwtDecode, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token || !jwtDecode) return;

      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);

        if (!decoded.id) {
          console.error('User ID not found in token.');
          handleLogout();
          return;
        }

        const response = await fetch(`http://localhost:5000/api/auth/user/${decoded.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData); // Backend returns { status, role, Actif }
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
      }
    };

    fetchUserData();
  }, [token, jwtDecode]);

  if (loading || userData === null) {
    console.log(loading)
    console.log(userData)
    return <div>Loading...</div>;
  }

  // Check if token is missing or invalid
  if (!token) {
    console.warn('No token found. Redirecting to login.');
    handleLogout();
    return <Navigate to="/login" replace />;
  }
  const currentTime = Date.now() / 1000; // Current time in seconds

  if (userData.expiration_date < currentTime) {
    setUserData(prevData => ({ ...prevData, Actif: false }));
    handleLogout();

    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  // Additional checks and conditions for role and status
  if (userData?.status === 'waiting') {
    console.warn('Account is waiting for approval. Redirecting to login.');
    setUserData((prevData) => ({ ...prevData, Actif: false }));
    handleLogout();
    return <Navigate to="/login" replace />;
  }

  if (userData?.status === 'rejected') {
    console.warn('Account rejected. Redirecting to rejected page.');
    setUserData((prevData) => ({ ...prevData, Actif: false }));
    handleLogout();
    return <Navigate to="/login" replace />;
  }

  // Authorized users: admin and advanced users
  if (['admin', 'Advanced_user'].includes(userData?.role)) {
    return children; // Authorized user
  }

  // If user doesn't match the role, log them out
  console.warn('Unauthorized access. Logging out and redirecting to login.');
  setUserData((prevData) => ({ ...prevData, Actif: false }));
  handleLogout();
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;