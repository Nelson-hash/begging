// src/components/UserMenu.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { User, LogOut } from 'lucide-react';

const UserMenu: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center text-gray-800 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="h-5 w-5 text-violet-500" />
          )}
        </div>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-20">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                {user?.email || user?.user_metadata?.name || 'User'}
              </div>
              <Link 
                to="/my-page" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                My Begging Page
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </div>
              </button>
            </>
          ) : (
            <Link 
              to="/register" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
