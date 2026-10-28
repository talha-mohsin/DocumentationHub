import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from './components/ToastContainer';
import AppRoutes from "./config/AppRoutes";

function App() {
  return (
    <CookiesProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
