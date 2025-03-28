// src/components/PaymentOptions.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface PaymentOptionsProps {
  pageId?: string;
  pageTitle?: string;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ pageId, pageTitle }) => {
  const [amount, setAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomAmount, setShowCustomAmount] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setShowCustomAmount(false);
  };

  const handleCustomAmountToggle = () => {
    setShowCustomAmount(true);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
  };

  const recordDonation = async () => {
    if (!pageId) return;
    
    const finalAmount = showCustomAmount ? parseFloat(customAmount) : amount;
    
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a valid donation amount');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('donations')
        .insert([
          { 
            page_id: pageId,
            amount: finalAmount,
            donor_name: donorName || 'Anonymous',
            message: message,
            currency: 'USD'
          }
        ]);
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error recording donation:', err);
      return false;
    }
  };

  const handlePayPalDonation = async () => {
    setIsProcessing(true);
    
    const finalAmount = showCustomAmount ? parseFloat(customAmount) : amount;
    
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Please enter a valid donation amount');
      setIsProcessing(false);
      return;
    }
    
    // Record the donation first
    const success = await recordDonation();
    
    if (success) {
      // Replace 'YourPayPalUsername' with your actual PayPal.me username
      const paypalUsername = 'YourPayPalUsername';
      window.open(`https://www.paypal.me/${paypalUsername}/${finalAmount}`, '_blank');
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
      <h3 className="text-xl font-bold text-center mb-4">Donate to support</h3>
      {pageTitle && <h4 className="text-lg font-semibold text-center text-violet-600 mb-6">{pageTitle}</h4>}
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Choose amount:</p>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[5, 10, 20].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleAmountSelect(value)}
              className={`py-2 px-4 rounded-lg ${
                amount === value && !showCustomAmount
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ${value}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[50, 100, 200].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleAmountSelect(value)}
              className={`py-2 px-4 rounded-lg ${
                amount === value && !showCustomAmount
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ${value}
            </button>
          ))}
        </div>
        
        {!showCustomAmount ? (
          <button
            type="button"
            onClick={handleCustomAmountToggle}
            className="text-sm text-violet-600 mt-1"
          >
            Enter custom amount
          </button>
        ) : (
          <div className="mt-2">
            <label className="text-sm text-gray-600">Custom amount:</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full py-2 pl-8 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Your name (optional):</label>
        <input
          type="text"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          placeholder="Anonymous"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-1">Message (optional):</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
          placeholder="Add a message..."
          rows={2}
          maxLength={100}
        />
      </div>
      
      <motion.button
        onClick={handlePayPalDonation}
        disabled={isProcessing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-center font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Donate with PayPal'}
      </motion.button>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Your donation helps support this beggar. Thank you for your generosity!
      </p>
    </div>
  );
};

export default PaymentOptions;
