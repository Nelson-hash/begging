import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Share2, Edit } from 'lucide-react';

const MyPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);

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
      } catch (err: any) {
        console.error('Error fetching page:', err);
        setError(err.message || 'Failed to load page');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [user, isAuthenticated, isLoading, navigate]);

  const handleCreatePage = () => {
    navigate('/reason');
  };

  const handleShare = (platform: string) => {
    if (!pageData) return;
    
    const shareUrl = window.location.origin + '/donate/' + pageData.id;
    const title = `Help ${pageData.title || 'me'} - Begging.app`;
    const text = `Check out my begging page: ${pageData.title || 'Need your help!'}`;
    
    let shareLink;
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        setShowShareOptions(false);
        return;
    }
    
    window.open(shareLink, '_blank');
    setShowShareOptions(false);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // First time user with no page
  if (!pageData) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Create Your Begging Page</h1>
        <p className="text-gray-600 mb-8">
          You haven't created a begging page yet. Start by telling us what you're begging for.
        </p>
        <button
          onClick={handleCreatePage}
          className="py-4 px-8 bg-gradient-to-r from-violet-400 to-indigo-400 text-white rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Create My Page
        </button>
      </div>
    );
  }

  // Existing page
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-500 to-teal-400 bg-clip-text text-transparent">
          GIVE ME MONEY<br />
          FOR {pageData.title}
        </h1>
        
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/reason')}
            className="flex items-center gap-2 py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Edit className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">Edit</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="flex items-center gap-2 py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Share</span>
            </button>
            
            {showShareOptions && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10 w-40">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span>LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span>Copy Link</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {pageData.gif_url && (
        <div className="mb-8">
          <img 
            src={pageData.gif_url}
            alt="Begging GIF"
            className="mx-auto max-h-80 rounded-lg"
          />
        </div>
      )}
      
      {pageData.reason && (
        <div className="mb-8">
          <p className="text-lg text-gray-700 whitespace-pre-line">
            {pageData.reason}
          </p>
        </div>
      )}
      
      <div className="flex flex-col items-center gap-4">
        <button className="py-4 px-8 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
          Donate via PayPal
        </button>
        
        <button className="py-4 px-8 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
          Donate Crypto
        </button>
      </div>
    </div>
  );
};

export default MyPage;
