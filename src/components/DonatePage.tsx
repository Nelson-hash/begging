// src/components/DonatePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import DonateButton from './DonateButton';
import PaymentOptions from './PaymentOptions';

const DonatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('begging_pages')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setPageData(data);
      } catch (err: any) {
        console.error('Error fetching page:', err);
        setError(err.message || 'Failed to load donation page');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [id]);

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

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-red-500" style={{ fontFamily: 'Space Grotesk' }}>
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, this donation page doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

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
                  <DonateButton />
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
                  <PaymentOptions />
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
      </div>
    </div>
  );
};

export default DonatePage;
