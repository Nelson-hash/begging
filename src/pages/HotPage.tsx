import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Users } from 'lucide-react';

interface HotReason {
  reason: string;
  username: string;
  amount: number;
  supporters: number;
}

const hotReasons: HotReason[] = [
  { reason: "PIZZA 🍕", username: "pizzalover42", amount: 420.69, supporters: 69 },
  { reason: "COFFEE ☕", username: "coffeeholic", amount: 1337.42, supporters: 42 },
  { reason: "BITCOIN 💰", username: "cryptobro", amount: 9999.99, supporters: 21 },
  { reason: "SCHOOL 📚", username: "brokeStudent", amount: 777.77, supporters: 55 },
  { reason: "NETFLIX 🎬", username: "netflixAndBill", amount: 666.66, supporters: 33 },
];

const HotPage = () => {
  return (
    <div className="min-h-screen bg-white pt-20 px-4 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-3 mb-12">
          <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl font-bold text-center" style={{ fontFamily: 'Space Grotesk' }}>
            Hottest Beggars
          </h1>
        </div>

        <div className="space-y-4">
          {hotReasons.map((item, index) => (
            <motion.div
              key={item.reason}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-4 sm:p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                    {item.reason}
                  </span>
                  <span className="text-sm text-gray-500">
                    by <span className="font-medium text-gray-700">{item.username}</span>
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-500">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-blue-500">
                      {item.supporters}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HotPage;