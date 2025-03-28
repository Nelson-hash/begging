import React from 'react';
import { motion } from 'framer-motion';

interface PaymentOptionProps {
  icon: React.ElementType;
  label: string;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({ icon: Icon, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
  >
    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
    <span className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{label}</span>
  </motion.div>
);

export default PaymentOption;