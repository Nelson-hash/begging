// src/components/MyPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const MyPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated && !isLoading) {
      navigate('/register');
      return;
    }

    const fetchPageData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('begging_pages')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No page found - first time user
            setPageData(null);
          } else {
            throw error;
          }
        } else {
          setPageData(data);
        }
      } catch (err) {
        console.error('Error fetching page:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [user, isAuthenticated, navigate]);

  const handleCreatePage = () => {
    navigate('/reason');
  };

  const handleDeletePage = async () => {
    if (!user || !pageData?.id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('begging_pages')
        .delete()
        .eq('id', pageData.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      navigate('/');
    } catch (err) {
      console.error('Error deleting page:', err);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // First time user with no page
  if (!pageData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-6">
            Create Your Begging Page
          </h1>
          <p className="text-gray-600 mb-8">
            You haven't created a begging page yet. Tell us what you're begging for!
          </p>
          <button
            onClick={handleCreatePage}
            className="px-8 py-4 bg-violet-500 text-white rounded-full text-xl font-bold"
          >
            START BEGGING NOW
          </button>
        </div>
      </div>
    );
  }

  // Existing page
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl sm:text-7xl font-bold mb-8 bg-gradient-to-r from-violet-400 via-fuchsia-500 to-teal-400 bg-clip-text text-transparent">
          GIVE ME MONEY
          <br />
          FOR {pageData.title?.toUpperCase()}
        </h1>
        
        {pageData.gif_url && (
          <div className="mb-8">
            <img 
              src={pageData.gif_url} 
              alt="GIF" 
              className="max-h-60 mx-auto rounded"
            />
          </div>
        )}
        
        {pageData.reason && (
          <p className="text-lg text-gray-600 mb-8 italic">
            "{pageData.reason}"
          </p>
        )}
        
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate('/reason')}
            className="px-6 py-3 bg-violet-100 text-violet-700 rounded-lg"
          >
            Edit Page
          </button>
          
          {showConfirm ? (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="mb-2">Are you sure you want to delete your page?</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePage}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1 text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              Delete Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
