// src/pages/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate('/my-page');
    }
    
    // Check if Supabase is configured
    const isConfigured = Boolean(
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    setSupabaseConfigured(isConfigured);
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Please set up your project first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/reason`
        }
      });

      if (error) throw error;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Space Grotesk' }}>
          Quick Registration
        </h1>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-4"
          >
            {error}
          </motion.p>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Chrome className="w-5 h-5 text-blue-500" />
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            By signing in, you'll be able to create your own begging page and start collecting donations.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
