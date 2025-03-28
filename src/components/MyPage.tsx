// src/components/MyPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import DonateButton from './DonateButton';
import PaymentOptions from './PaymentOptions';
import DonationHistory from './DonationHistory';

const MyPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    if (!user || !pageData?.id) {
      console.error("Cannot delete: missing user or page ID");
      return;
    }
    
    setIsDeleting(true);
    
    try {
      console.log("Attempting to delete page with ID:", pageData.id);
      
      const { error } = await supabase
        .from('begging_pages')
        .delete()
        .match({ id: pageData.id, user_id: user.id });
      
      if (error) {
        console.error("Supabase delete error:", error);
        throw error;
      }
      
      console.log("Page successfully deleted");
      
      // Refresh the page list or redirect
      navigate('/');
      
    } catch (err) {
      console.error('Error deleting page:', err);
      alert('Failed to delete page. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleHover = (hover: boolean) => {
    if (!showPaymentOptions) {
      setIsHovered(hover);
    }
  };

  const handleDonateClick = () => {
    setShowPaymentOptions(true);
    setIsHovered(false);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // First time user with no page
  if (!pageData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            Create Your Begging Page
          </h1>
          <p className="text-gray-600 mb-8">
            You haven't created a begging page yet. Tell us what you're begging for and start receiving donations!
          </p>
          <button
            onClick={handleCreatePage}
            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            START BEGGING NOW
          </button>
        </motion.div>
      </div>
    );
  }

  // Existing page
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-12 px-4">
      <div className="flex-1 flex items-center">
        <motion.div 
          className={`text-center relative ${!showPaymentOptions ? 'cursor-pointer' : ''}`}
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          layout
        >
          <motion.div 
            layout
            className="relative"
            animate={{ 
              y: showPaymentOptions ? -80 : isHovered ? -20 : 0,
              opacity: showPaymentOptions ? 0.3 : 1
            }}
            transition={{ 
              duration: 0.6,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-500 to-teal-400 bg-clip-text text-transparent">
              GIVE ME
            </h1>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-500 to-teal-400 bg-clip-text text-transparent">
              MONEY
            </h1>
          </motion.div>
          
          <AnimatePresence>
            {isHovered && !showPaymentOptions && (
              <motion.div
                layout
                className="h-16 sm:h-20 flex items-center justify-center"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
              >
                <div onClick={handleDonateClick}>
                  <DonateButton onClick={handleDonateClick} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPaymentOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm"
                onClick={() => setShowPaymentOptions(false)}
              >
                <div onClick={e => e.stopPropagation()} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                  <PaymentOptions pageId={pageData.id} pageTitle={pageData.title} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            layout
            animate={{ 
              y: showPaymentOptions ? 80 : isHovered ? 20 : 0,
              opacity: showPaymentOptions ? 0.3 : 1
            }}
            transition={{ 
              duration: 0.6,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-500 to-teal-400 bg-clip-text text-transparent">
              FOR {pageData.title?.toUpperCase()}
            </h1>
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full max-w-6xl flex justify-between items-end mt-8">
        {(pageData.gif_url || pageData.reason) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-end gap-4"
          >
            {pageData.gif_url && (
              <div className="w-48 h-48 rounded-lg overflow-hidden">
                <img src={pageData.gif_url} alt="Convincing GIF" className="w-full h-full object-cover" />
              </div>
            )}
            {pageData.reason && (
              <div className="max-w-xs">
                <p className="text-sm text-gray-600 italic">"{pageData.reason}"</p>
              </div>
            )}
          </motion.div>
        )}
        
        <div className="relative">
          <button 
            onClick={() => navigate('/reason')}
            className="flex items-center gap-1 py-2 px-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-700"
          >
            Edit Page
          </button>
        </div>
      </div>
      
      {/* Delete page button */}
      <div className="fixed bottom-6 right-6">
        {showConfirm ? (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-sm text-gray-700 mb-3">Are you sure you want to delete your page?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md text-sm"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePage}
                className="py-2 px-4 bg-red-500 text-white rounded-md text-sm"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-full shadow-md"
            title="Delete page"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Donation History */}
      {pageData && (
        <DonationHistory pageId={pageData.id} />
      )}
    </div>
  );
};

export default MyPage;
