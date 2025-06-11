import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ 
  user, 
  onProfileClick, 
  onSettingsClick, 
  onNotificationsClick,
  darkMode,
  onToggleDarkMode 
}) => {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img 
              src="/src/assets/icon.png" 
              alt="SaveUp" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-xl font-bold genz-gradient-text">SaveUp</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your savings companion</p>
            </div>
          </motion.div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-3">
            {/* User Greeting */}
            {user && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hey, {user.name}! 👋
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keep saving!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={onToggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-600" />
                )}
              </motion.button>

              {/* Notifications */}
              <motion.button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                {/* Notification Badge */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>

              {/* Settings */}
              <motion.button
                onClick={onSettingsClick}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.button>

              {/* Profile */}
              <motion.button
                onClick={onProfileClick}
                className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.name || 'Profile'}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

