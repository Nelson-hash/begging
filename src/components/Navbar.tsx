// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Share2, Edit } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const location = useLocation();
  
  // Only show Edit/Share buttons on My Page
  const isMyPage = location.pathname === '/my-page';
  
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
          to="/hot" 
          className="text-gray-800 hover:text-gray-600 font-medium"
        >
          Hottest Beggars
        </Link>
        
        {isAuthenticated && isMyPage && (
          <>
            <Link 
              to="/edit-page" 
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Page</span>
            </Link>
            
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            {showShareOptions && (
              <div className="absolute top-14 right-6 bg-white shadow-lg rounded-lg p-3 z-10">
                {/* Share options will go here */}
                <button className="w-full text-left py-2 px-3 hover:bg-gray-100 rounded-md">
                  Twitter
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-100 rounded-md">
                  Facebook
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-100 rounded-md">
                  Copy Link
                </button>
              </div>
            )}
          </>
        )}
        
        {isAuthenticated ? (
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span className="text-violet-500 font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
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
