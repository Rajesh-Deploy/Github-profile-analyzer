import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, description, colorClass = "text-primary-light" }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card p-5 rounded-2xl flex items-start justify-between shadow-glass hover:shadow-glass-hover transition-all duration-300"
    >
      <div className="space-y-2">
        <span className="text-xs font-semibold tracking-wider text-brandDark-400 uppercase">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
          {value !== undefined && value !== null ? value.toLocaleString() : '0'}
        </div>
        {description && (
          <p className="text-[11px] text-brandDark-500 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      <div className={`p-3 rounded-xl bg-brandDark-900/60 border border-brandDark-800 ${colorClass}`}>
        <span className="text-xl sm:text-2xl">{icon}</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
