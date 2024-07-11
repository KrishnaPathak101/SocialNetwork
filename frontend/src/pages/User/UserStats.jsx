// src/Components/UserStats.js
import React from 'react';

const UserStats = ({ followingCount, followersCount, onFollowingClick, onFollowersClick }) => (
  <div className="flex mt-4 space-x-4">
    <div className="flex items-center space-x-1 cursor-pointer" onClick={onFollowingClick}>
      <span className="font-semibold text-gray-900 dark:text-white">{followingCount}</span>
      <span className="text-gray-500 dark:text-gray-400">Following</span>
    </div>
    <div className="flex items-center space-x-1 cursor-pointer" onClick={onFollowersClick}>
      <span className="font-semibold text-gray-900 dark:text-white">{followersCount}</span>
      <span className="text-gray-500 dark:text-gray-400">Followers</span>
    </div>
  </div>
);

export default UserStats;
