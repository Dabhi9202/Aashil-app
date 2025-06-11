import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  current, 
  target, 
  className = '', 
  showPercentage = true, 
  showAmount = true,
  animated = true,
  size = 'md' 
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Info */}
      {(showPercentage || showAmount) && (
        <div className="flex justify-between items-center mb-2">
          {showAmount && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {formatCurrency(current)} of {formatCurrency(target)}
              </span>
            </div>
          )}
          {showPercentage && (
            <span className="text-sm font-bold genz-gradient-text">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress Bar Container */}
      <div className={`genz-progress-bar ${sizeClasses[size]} relative overflow-hidden`}>
        {/* Progress Fill */}
        <motion.div
          className="genz-progress-fill h-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0, 
            ease: "easeOut",
            delay: animated ? 0.2 : 0
          }}
        >
          {/* Shimmer Effect */}
          {animated && percentage > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear"
              }}
            />
          )}
        </motion.div>
        
        {/* Milestone Markers */}
        {[25, 50, 75].map((milestone) => (
          <div
            key={milestone}
            className="absolute top-0 bottom-0 w-0.5 bg-white/50"
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>
      
      {/* Milestone Labels */}
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProgressBar;

