// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Navbar from './components/Navbar';

// Import your existing pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ReasonPage from './pages/ReasonPage';
import ResultPage from './pages/ResultPage';
import MyPage from './components/MyPage';

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
              
              {/* Protected routes */}
              <Route path="/reason" element={
                <ProtectedRoute>
                  <ReasonPage />
                </ProtectedRoute>
              } />
              
              <Route path="/result" element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              } />
              
              <Route path="/my-page" element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              } />
              
              {/* Add more routes as needed */}
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
