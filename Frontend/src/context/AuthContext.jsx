import { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(cookies.user || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.user);

  // Sync state whenever the cookie changes
  useEffect(() => {
    if (cookies.user) {
      setUser(cookies.user);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [cookies.user]);

  const login = (userData) => {
    setCookie('user', userData, {
      path: '/',
      maxAge: 86400,
      secure: false,
      sameSite: 'lax',
    });
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeCookie('user', { path: '/' });
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
