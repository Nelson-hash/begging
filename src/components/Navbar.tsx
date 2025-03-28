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
            to="/hot" 
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
