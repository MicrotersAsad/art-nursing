import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded) {
          setUser(decoded);
        } else {
          console.error("Token decoding failed");
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
    setLoading(false); // Set loading to false after token fetching is done
  }, [router]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const token = response.data.token;
      const decoded = jwt.decode(token);
      if (decoded) {
        setUser({
          ...decoded,
          profileImage: response.data.profileImage,  // Add profile image to user state
        });
        localStorage.setItem('token', token);
      } else {
        console.error("Token decoding failed on login");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  const updateUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({
        ...user,
        profileImage: response.data.profileImage, // Update the profile image in user state
        ...response.data,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Add prop type validation for children
};

export const useAuth = () => useContext(AuthContext);
