// src/components/DonationHistory.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  currency: string;
  message: string;
  created_at: string;
}

interface DonationHistoryProps {
  pageId: string;
}

const DonationHistory: React.FC<DonationHistoryProps> = ({ pageId }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDonations, setTotalDonations] = useState<number>(0);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!pageId) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('page_id', pageId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setDonations(data || []);
        
        // Calculate total
        if (data && data.length > 0) {
          const total = data.reduce((sum, donation) => sum + parseFloat(donation.amount.toString()), 0);
          setTotalDonations(total);
        }
        
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError('Failed to load donations history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [pageId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading donations...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full max-w-md mx-auto px-4"
    >
      <h3 className="text-xl font-bold mb-4">Donation History</h3>

      {donations.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No donations yet. Share your page to start receiving support!</p>
      ) : (
        <>
          <div className="bg-violet-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700">Total Received: <span className="font-bold text-violet-600">${totalDonations.toFixed(2)}</span></p>
            <p className="text-gray-700">Number of Donations: <span className="font-bold text-violet-600">{donations.length}</span></p>
          </div>

          <div className="space-y-3">
            {donations.map((donation) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{donation.donor_name}</p>
                    <p className="text-sm text-gray-500">{formatDate(donation.created_at)}</p>
                  </div>
                  <p className="font-bold text-violet-600">${parseFloat(donation.amount.toString()).toFixed(2)}</p>
                </div>
                {donation.message && (
                  <p className="text-sm text-gray-700 italic">"{donation.message}"</p>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DonationHistory;
