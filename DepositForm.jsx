import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, PiggyBank, Zap, Gift } from 'lucide-react';
import { useGoals } from '../../context/GoalsContext';

const DepositForm = ({ isOpen, onClose, goalId, goalTitle }) => {
  const { addDeposit, goals } = useGoals();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const goal = goals.find(g => g.id === goalId);
  
  // Quick amount suggestions based on goal target
  const quickAmounts = goal ? [
    Math.round(goal.targetAmount * 0.05), // 5%
    Math.round(goal.targetAmount * 0.1),  // 10%
    Math.round(goal.targetAmount * 0.15), // 15%
    Math.round(goal.targetAmount * 0.25)  // 25%
  ].filter(amount => amount > 0 && amount <= 1000) : [];

  const motivationalMessages = [
    "Every dollar counts! 💪",
    "You're crushing it! 🚀",
    "Building wealth one deposit at a time! 💎",
    "Future you will thank you! ⭐",
    "Making moves! 🔥",
    "Savings superstar! ⚡"
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setSelectedQuickAmount(null);
      setError('');
    }
  };

  const handleQuickAmountSelect = (quickAmount) => {
    setAmount(quickAmount.toString());
    setSelectedQuickAmount(quickAmount);
    setError('');
  };

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (numAmount > 10000) {
      setError('Maximum deposit amount is $10,000');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAmount()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const numAmount = parseFloat(amount);
      addDeposit(goalId, numAmount, description || 'Manual deposit');
      
      // Show success message
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      
      // Reset form
      setAmount('');
      setDescription('');
      setSelectedQuickAmount(null);
      
      // Close modal after a brief delay to show success
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error adding deposit:', error);
      setError('Failed to add deposit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !goal) return null;

  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const progressAfterDeposit = amount ? 
    Math.min(((goal.currentAmount + parseFloat(amount)) / goal.targetAmount) * 100, 100) : 
    (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="genz-card max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold genz-gradient-text">Add Money</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{goalTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Goal Progress Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Current Progress</span>
              <span className="text-sm font-bold genz-gradient-text">
                {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-lg font-bold mb-1">
              ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              ${remainingAmount.toLocaleString()} remaining
            </div>
          </div>

          {/* Quick Amount Buttons */}
          {quickAmounts.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                <Zap className="w-4 h-4 inline mr-2" />
                Quick Add
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <motion.button
                    key={quickAmount}
                    type="button"
                    onClick={() => handleQuickAmountSelect(quickAmount)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium ${
                      selectedQuickAmount === quickAmount
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ${quickAmount}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Amount Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Gift className="w-4 h-4 inline mr-2" />
                Note (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Birthday money, Side hustle earnings"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={100}
              />
            </div>

            {/* Progress Preview */}
            {amount && parseFloat(amount) > 0 && (
              <motion.div
                className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    After this deposit
                  </span>
                </div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {progressAfterDeposit.toFixed(0)}% complete
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  ${(goal.currentAmount + parseFloat(amount)).toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              className="w-full genz-button-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                `Add $${amount || '0'} to Goal`
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DepositForm;

