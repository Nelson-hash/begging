import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

type User = {
  id: string;
  email?: string;
  user_metadata?: any;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session when the component mounts
    const checkUser = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } else if (data && data.session) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };

    // Call the check function
    checkUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        signOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

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
