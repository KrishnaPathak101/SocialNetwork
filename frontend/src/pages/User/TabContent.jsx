// src/Components/TabContent.js
import React from 'react';
import Twitterfeeed from '.././../Components/Twitterfeed'

const TabContent = ({ activeTab, userId }) => (
  <div className="p-4 space-y-4">
    {activeTab === 'you' && <Twitterfeeed userId={userId} userpost={'true'} />}
    {activeTab === 'following' && (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Following</h2>
      </div>
    )}
  </div>
);

export default TabContent;
