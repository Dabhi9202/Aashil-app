import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Target, Zap } from 'lucide-react';
import Header from '../components/layout/Header';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import DepositForm from '../components/savings/DepositForm';
import ProgressBar from '../components/savings/ProgressBar';
import { useGoals } from '../context/GoalsContext';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [depositGoal, setDepositGoal] = useState({ id: null, title: '' });
  
  // Sample user data
  const user = {
    id: 1,
    name: 'Alex',
    email: 'alex@example.com',
    avatar: null
  };

  const { 
    goals, 
    totalSaved, 
    totalTarget, 
    completedGoals, 
    deleteGoal,
    loading,
    error 
  } = useGoals();

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setShowGoalForm(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleDeposit = (goalId, goalTitle) => {
    setDepositGoal({ id: goalId, title: goalTitle });
    setShowDepositForm(true);
  };

  const handleWithdraw = (goalId) => {
    // TODO: Implement withdraw functionality
    console.log('Withdraw from goal:', goalId);
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      deleteGoal(goalId);
    }
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${darkMode ? 'dark' : ''}`}>
      <Header
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onProfileClick={() => console.log('Profile clicked')}
        onSettingsClick={() => console.log('Settings clicked')}
        onNotificationsClick={() => console.log('Notifications clicked')}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-2">
            <span className="genz-gradient-text">Welcome back, {user.name}!</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {goals.length === 0 
              ? "Ready to start your savings journey? Create your first goal! 🚀"
              : "You're doing amazing! Keep up the great work on your savings journey. 🚀"
            }
          </p>
        </motion.div>

        {/* Stats Overview */}
        {goals.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Total Saved */}
            <div className="genz-card p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold genz-gradient-text">{formatCurrency(totalSaved)}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Saved</p>
            </div>

            {/* Goals Progress */}
            <div className="genz-card p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold genz-gradient-text">{completedGoals}/{goals.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Goals Completed</p>
            </div>

            {/* Savings Rate */}
            <div className="genz-card p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold genz-gradient-text">
                {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Overall Progress</p>
            </div>
          </motion.div>
        )}

        {/* Overall Progress */}
        {goals.length > 0 && totalTarget > 0 && (
          <motion.div
            className="genz-card p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-4 genz-gradient-text">Overall Savings Progress</h3>
            <ProgressBar
              current={totalSaved}
              target={totalTarget}
              size="lg"
              animated={true}
            />
          </motion.div>
        )}

        {/* Goals Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold genz-gradient-text">
              {goals.length === 0 ? 'Create Your First Goal' : 'Your Goals'}
            </h3>
            <motion.button
              className="genz-button-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateGoal}
            >
              <Plus className="w-4 h-4" />
              New Goal
            </motion.button>
          </div>

          {/* Goals Grid or Empty State */}
          {goals.length === 0 ? (
            <motion.div
              className="genz-card p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 genz-gradient-text">No Goals Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start your savings journey by creating your first goal! Whether it's a new gaming console, 
                a car, or a dream vacation - every big achievement starts with a goal.
              </p>
              <motion.button
                className="genz-button-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateGoal}
              >
                Create Your First Goal
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <GoalCard
                    goal={goal}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        {goals.length > 0 && (
          <motion.div
            className="genz-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h3 className="text-xl font-bold mb-4 genz-gradient-text">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateGoal}
              >
                Add Goal
              </motion.button>
              <motion.button
                className="p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Stats
              </motion.button>
              <motion.button
                className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Achievements
              </motion.button>
              <motion.button
                className="p-4 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Progress
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <GoalForm
        isOpen={showGoalForm}
        onClose={() => {
          setShowGoalForm(false);
          setEditingGoal(null);
        }}
        editingGoal={editingGoal}
      />

      <DepositForm
        isOpen={showDepositForm}
        onClose={() => {
          setShowDepositForm(false);
          setDepositGoal({ id: null, title: '' });
        }}
        goalId={depositGoal.id}
        goalTitle={depositGoal.title}
      />
    </div>
  );
};

export default Dashboard;

