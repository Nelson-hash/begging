// src/pages/ReasonPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Image, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';

const ReasonPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [reason, setReason] = useState('');
  const [gif, setGif] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState('');
  const [justification, setJustification] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [existingPage, setExistingPage] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has a page
    const checkExistingPage = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('begging_pages')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking existing page:', error);
        } else if (data) {
          setExistingPage(data);
          setReason(data.title || '');
          setJustification(data.reason || '');
          setGifUrl(data.gif_url || '');
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingPage();
  }, [user, isAuthenticated]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'image/gif') {
      setGif(file);
      
      // Create a local URL for the file for preview
      const objectUrl = URL.createObjectURL(file);
      setGifUrl(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/gif': ['.gif']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setError('You must be logged in to create a page');
      return;
    }

    if (!reason.trim()) {
      setError('Please enter what you are begging for');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Handle file upload if there's a gif
      let finalGifUrl = gifUrl;
      if (gif) {
        const reader = new FileReader();
        reader.readAsDataURL(gif);
        
        // Use the Data URL as the gif_url for simplicity
        // In a production app, you'd want to upload to storage
        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            finalGifUrl = reader.result as string;
            resolve();
          };
        });
      }

      const pageData = {
        user_id: user.id,
        title: reason,
        reason: justification,
        gif_url: finalGifUrl,
        updated_at: new Date()
      };

      let result;
      
      if (existingPage) {
        // Update existing page
        result = await supabase
          .from('begging_pages')
          .update(pageData)
          .eq('id', existingPage.id);
      } else {
        // Create new page
        result = await supabase
          .from('begging_pages')
          .insert([pageData]);
      }

      if (result.error) {
        throw result.error;
      }

      // Prepare search params for result page
      const searchParams = new URLSearchParams();
      searchParams.set('reason', reason);
      searchParams.set('justification', justification);
      
      if (finalGifUrl) {
        searchParams.set('gif', finalGifUrl);
      }
      
      navigate(`/result?${searchParams.toString()}`);
    } catch (err: any) {
      console.error('Error saving page:', err);
      setError(err.message || 'Failed to save your page');
      setIsLoading(false);
    }
  };

  const goToMyPage = () => {
    navigate('/my-page');
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {existingPage && (
        <div className="mb-6 absolute top-4 left-4">
          <button
            onClick={goToMyPage}
            className="text-violet-600 hover:text-violet-800 font-medium flex items-center"
          >
            ← Back to my page
          </button>
        </div>
      )}
      
      <motion.form 
        onSubmit={handleSubmit}
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-8">
          <motion.div 
            className="w-full text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason here..."
              className="w-full px-4 py-3 text-xl sm:text-3xl text-center bg-transparent border-b-2 border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
              style={{ fontFamily: 'Space Grotesk' }}
              autoFocus
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full space-y-4"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-violet-400 bg-violet-50' : 'border-gray-300 hover:border-violet-400'}`}
            >
              <input {...getInputProps()} />
              <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              {gifUrl ? (
                <div className="space-y-2">
                  <img src={gifUrl} alt="Selected GIF" className="max-h-40 mx-auto rounded" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGif(null);
                      setGifUrl('');
                    }}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {isDragActive ? 'Drop your GIF here' : 'Add a convincing GIF (optional)'}
                </p>
              )}
            </div>

            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Brief explanation of why you need this... (optional)"
              className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors resize-none"
              rows={3}
              maxLength={200}
            />
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full bg-red-50 text-red-500 p-3 rounded-md text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2 bg-gradient-to-r from-violet-400 to-indigo-400 text-white rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              {isLoading ? 'Saving...' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-gray-400 text-xs">
              Press Enter to continue
            </p>
          </motion.div>
        </div>
      </motion.form>
    </div>
  );
};

export default ReasonPage;
