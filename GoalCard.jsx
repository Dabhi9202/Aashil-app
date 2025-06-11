import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, DollarSign, Lock, Unlock, Edit, Trash2 } from 'lucide-react';
import ProgressBar from '../savings/ProgressBar';

const GoalCard = ({ 
  goal, 
  onEdit, 
  onDeposit, 
  onWithdraw,
  onDelete,
  className = '' 
}) => {
  const {
    id,
    title,
    description,
    targetAmount,
    currentAmount,
    deadline,
    category,
    image,
    isLocked,
    createdAt
  } = goal;

  const progress = (currentAmount / targetAmount) * 100;
  const isCompleted = progress >= 100;
  const daysLeft = deadline ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      gaming: '🎮',
      transportation: '🚗',
      fashion: '👕',
      electronics: '📱',
      travel: '✈️',
      education: '📚',
      health: '💪',
      entertainment: '🎬',
      other: '🎯'
    };
    return emojis[category?.toLowerCase()] || emojis.other;
  };

  return (
    <motion.div
      className={`genz-card p-6 hover:scale-105 transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      layout
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {image ? (
              <img src={image} alt={title} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <span>{getCategoryEmoji(category)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg genz-gradient-text">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isLocked ? (
            <Lock className="w-4 h-4 text-red-500" />
          ) : (
            <Unlock className="w-4 h-4 text-green-500" />
          )}
          {isCompleted && (
            <motion.div
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              🎉
            </motion.div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <ProgressBar
          current={currentAmount}
          target={targetAmount}
          size="lg"
          animated={true}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="font-semibold">{formatCurrency(targetAmount - currentAmount)}</p>
          </div>
        </div>
        
        {deadline && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Days left</p>
              <p className={`font-semibold ${daysLeft < 30 ? 'text-red-500' : 'text-green-500'}`}>
                {daysLeft > 0 ? daysLeft : 'Overdue'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          className="flex-1 genz-button-primary text-sm py-2"
          onClick={() => onDeposit(id, title)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isCompleted}
        >
          {isCompleted ? 'Goal Reached!' : 'Add Money'}
        </motion.button>
        
        {!isLocked && currentAmount > 0 && (
          <motion.button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={() => onWithdraw(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Withdraw
          </motion.button>
        )}
        
        <motion.button
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={() => onEdit(goal)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Edit className="w-4 h-4" />
        </motion.button>

        <motion.button
          className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
          onClick={() => onDelete(id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Completion Celebration */}
      {isCompleted && (
        <motion.div
          className="mt-4 p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <p className="font-bold">🎉 Goal Achieved! 🎉</p>
          <p className="text-sm">You saved {formatCurrency(targetAmount)} for your {title}!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoalCard;

