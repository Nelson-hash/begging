import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Bitcoin } from 'lucide-react';
import PaymentOption from './PaymentOption';
import LydiaIcon from './icons/LydiaIcon';

const PaymentOptions: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-16 justify-center items-center"
    >
      <PaymentOption icon={CreditCard} label="PayPal" />
      <PaymentOption icon={Bitcoin} label="Crypto" />
      <PaymentOption icon={LydiaIcon} label="Lydia" />
    </motion.div>
  );
};

export default PaymentOptions;