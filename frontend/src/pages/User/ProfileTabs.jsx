// src/Components/ProfileTabs.js
import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange }) => (
  <div className="border-b border-gray-200 dark:border-gray-800">
    <div className="flex justify-around">
      <button
        className={`flex-1 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-white ${activeTab === 'you' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        onClick={() => onTabChange('you')}
      >
        You
      </button>
      <button
        className={`flex-1 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-white ${activeTab === 'following' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        onClick={() => onTabChange('following')}
      >
        Following
      </button>
    </div>
  </div>
);

export default ProfileTabs;
