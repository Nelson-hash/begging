import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ReasonPage from './pages/ReasonPage';
import ResultPage from './pages/ResultPage';
import PageCreation from './components/PageCreation';
import UserPage from './components/UserPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/register" />;
  }
  
  return <>{children}</>;
};

// Main app with AuthProvider
const AppWithAuth = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reason" element={<ReasonPage />} />
              <Route path="/result" element={<ResultPage />} />
              
              {/* User page routes */}
              <Route path="/create-page" element={
                <ProtectedRoute>
                  <PageCreation />
                </ProtectedRoute>
              } />
              
              <Route path="/edit-page" element={
                <ProtectedRoute>
                  <PageCreation />
                </ProtectedRoute>
              } />
              
              <Route path="/my-page" element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              } />
              
              <Route path="/donate/:id" element={<UserPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Export the main app
const App = () => <AppWithAuth />;
export default App;

// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useAuth } from './AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-xl font-bold text-gray-800">
            Begging.app
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <Link 
              to="/my-page" 
              className="text-violet-600 hover:text-violet-800 font-medium"
            >
              My Page
            </Link>
          )}
          
          <Link 
            to="/hottest-beggars" 
            className="flex items-center gap-1 text-gray-800 hover:text-gray-600"
          >
            <span className="font-medium">Hottest Beggars</span>
            🔥
          </Link>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
