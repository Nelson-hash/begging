// src/pages/HotPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Fire, ArrowRight } from 'lucide-react';

const HotPage: React.FC = () => {
  const [popularPages, setPopularPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPopularPages = async () => {
      try {
        // In a real app, you would track page views/donations and order by them
        // For now, we'll just fetch the most recently created pages
        const { data, error } = await supabase
          .from('begging_pages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setPopularPages(data || []);
      } catch (err: any) {
        console.error('Error fetching popular pages:', err);
        setError(err.message || 'Failed to load popular pages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPages();
  }, []);

  if (isLoading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-red-500 mb-4">{error}</p>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Hottest Beggars 🔥
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out the most popular begging pages. These pages are receiving the most attention and donations.
          </p>
        </div>

        {popularPages.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-4">No begging pages found yet.</p>
            <p className="text-gray-600">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {popularPages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/donate/${page.id}`} className="block h-full">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">#{index + 1}</span>
                        {index < 3 && <Fire className="w-5 h-5 text-orange-500" />}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {page.title?.toUpperCase()}
                    </h2>

                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        {page.gif_url && (
                          <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={page.gif_url} 
                              alt="GIF" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                        {page.reason && (
                          <p className="text-sm text-gray-600 line-clamp-3">
                            "{page.reason}"
                          </p>
                        )}
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotPage;
