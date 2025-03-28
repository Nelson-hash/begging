// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  
  return (
    <header className="bg-white py-4 px-6 flex items-center justify-between">
      <div>
        <Link to="/" className="text-xl font-bold text-gray-800">
          Begging.app
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <Link 
            to="/my-page" 
            className="text-violet-600 hover:text-violet-800 font-medium"
          >
            My Page
          </Link>
        )}
        
        <Link 
          to="/" 
          className="text-gray-800 hover:text-gray-600 font-medium"
        >
          Hottest Beggars
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
              <span className="text-violet-500 font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <button 
              onClick={() => signOut()}
              className="text-sm text-gray-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link 
            to="/register" 
            className="py-2 px-4 bg-violet-500 text-white rounded-full text-sm font-bold"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
