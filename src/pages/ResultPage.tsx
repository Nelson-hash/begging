// src/pages/ResultPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Twitter, Facebook, Linkedin } from 'lucide-react';
import FallingText from '../components/FallingText';
import DonateButton from '../components/DonateButton';
import PaymentOptions from '../components/PaymentOptions';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const reason = searchParams.get('reason') || '';
  const gif = searchParams.get('gif');
  const justification = searchParams.get('justification');
  
  const [isHovered, setIsHovered] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('begging_pages')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setPageId(data.id);
      } catch (err) {
        console.error('Error fetching page ID:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [user]);

  useEffect(() => {
    const totalAnimationTime = 2.5;
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, totalAnimationTime * 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleHover = (hover: boolean) => {
    if (animationComplete && !showPaymentOptions) {
      setIsHovered(hover);
    }
  };

  const handleDonateClick = () => {
    setShowPaymentOptions(true);
    setIsHovered(false);
  };

  const handleCopyLink = async () => {
    try {
      // If we have a page ID, use a direct link to the page
      const shareLink = pageId 
        ? `${window.location.origin}/donate/${pageId}` 
        : `${window.location.origin}${location.pathname}${location.search}`;
        
      await navigator.clipboard.writeText(shareLink);
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    const text = `Help me get money for ${reason}! 🙏`;
    const shareLink = pageId 
      ? `${window.location.origin}/donate/${pageId}` 
      : window.location.href;
      
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const goToMyPage = () => {
    navigate('/my-page');
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.7 }}
        className="absolute top-4 right-4"
      >
        <button
          onClick={goToMyPage}
          className="py-2 px-4 bg-gradient-to-r from-violet-400 to-indigo-400 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
        >
          My Page
        </button>
      </motion.div>
      
      <div className="flex-1 flex items-center">
        <motion.div 
          className={`text-center relative ${animationComplete && !showPaymentOptions ? 'cursor-pointer' : ''}`}
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
            <FallingText text="GIVE" delay={0} className="text-4xl sm:text-6xl md:text-8xl" />
            <FallingText text="ME" delay={0.5} className="text-4xl sm:text-6xl md:text-8xl" />
            <FallingText text="MONEY" delay={1} className="text-4xl sm:text-6xl md:text-8xl" />
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
            <FallingText text="FOR" delay={1.5} fromBottom={true} className="text-4xl sm:text-6xl md:text-8xl" />
            <FallingText text={reason.toUpperCase()} delay={2} fromBottom={true} className="text-4xl sm:text-6xl md:text-8xl" />
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full max-w-6xl flex justify-between items-end mt-8">
        {(gif || justification) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5 }}
            className="flex items-end gap-4"
          >
            {gif && (
              <div className="w-48 h-48 rounded-lg overflow-hidden">
                <img src={gif} alt="Convincing GIF" className="w-full h-full object-cover" />
              </div>
            )}
            {justification && (
              <div className="max-w-xs">
                <p className="text-sm text-gray-600 italic">"{justification}"</p>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-gray-500">
            <Share2 className="w-4 h-4" />
            <span className="text-xs">Share with donors</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Twitter className="w-4 h-4 text-gray-700" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('facebook')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Facebook className="w-4 h-4 text-gray-700" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('linkedin')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-gray-700" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-700" />
              <AnimatePresence>
                {showCopiedTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-gray-500"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;
