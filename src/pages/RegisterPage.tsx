import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle, Instagram, Wallet, Chrome } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    const isConfigured = Boolean(
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    setSupabaseConfigured(isConfigured);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseConfigured) {
      setError('Supabase is not configured. Please set up your project first.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!captchaValue) {
      setError('Please complete the captcha');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Simulate successful registration
      navigate('/reason');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

 const handleSocialLogin = async (provider: 'google' | 'instagram') => {
  setLoading(true);
  setError('');

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'https://begging.vercel.app/reason',
        skipBrowserRedirect: false // Make sure this is false or omitted
      }
    });

    if (error) throw error;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Social login failed');
    setLoading(false);
  }
};
  
// Wallet connection (pseudo-code, you'll need to implement)
const handleWalletConnect = async () => {
  setLoading(true);
  try {
    // Implement Web3 wallet connection logic
    // Example with ethers.js or web3.js
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    navigate('/reason');
  } catch (error) {
    setError('Wallet connection failed');
  } finally {
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

        {!supabaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="text-amber-500 w-5 h-5 flex-shrink-0" />
            <p className="text-amber-700 text-sm">
              Please click the "Connect to Supabase" button in the top right to set up your project.
            </p>
          </motion.div>
        )}

        {!showEmailForm ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Continue with Email
            </button>

            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <Chrome className="w-5 h-5 text-blue-500" />
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin('instagram')}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-5 h-5" />
              Continue with Instagram
            </button>

            <button
              onClick={() => handleSocialLogin('wallet')}
              className="w-full px-6 py-3 bg-gray-900 rounded-lg text-white font-semibold flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleEmailSubmit}
            className="space-y-6"
          >
            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              ← Back to all options
            </button>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                minLength={6}
                className="w-full px-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
              />
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'missing-recaptcha-key'}
                onChange={(value) => setCaptchaValue(value)}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !supabaseConfigured}
              className="w-full px-6 py-3 bg-gradient-to-r from-violet-400 to-indigo-400 text-white rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterPage;
