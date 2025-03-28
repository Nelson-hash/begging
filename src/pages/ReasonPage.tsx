import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Image, ArrowRight } from 'lucide-react';

const ReasonPage = () => {
  const [reason, setReason] = useState('');
  const [gif, setGif] = useState<File | null>(null);
  const [justification, setJustification] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'image/gif') {
      setGif(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/gif': ['.gif']
    },
    maxFiles: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set('reason', reason);
      searchParams.set('justification', justification);
      
      if (gif) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Gif = reader.result as string;
          searchParams.set('gif', base64Gif);
          navigate(`/result?${searchParams.toString()}`);
        };
        reader.readAsDataURL(gif);
      } else {
        navigate(`/result?${searchParams.toString()}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
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
              {gif ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Selected GIF: {gif.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGif(null);
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <button
              type="submit"
              className="px-8 py-2 bg-gradient-to-r from-violet-400 to-indigo-400 text-white rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              Continue
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