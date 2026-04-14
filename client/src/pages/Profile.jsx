import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FaUser, FaEnvelope, FaCalendarAlt, FaMoon, FaSun } from 'react-icons/fa';

const Profile = () => {
  const { user, isDarkMode, toggleTheme } = useAppContext();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Please login to view your profile
          </h2>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 page-bottom-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <FaUser className="text-3xl text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.name || 'User'}
                </h1>
                <p className="text-green-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {/* User Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user.name || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Preferences
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isDarkMode ? (
                    <FaMoon className="text-gray-400 text-lg" />
                  ) : (
                    <FaSun className="text-gray-400 text-lg" />
                  )}
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Theme Mode
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Toggle between light and dark theme
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;