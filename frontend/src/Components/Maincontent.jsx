import { useState } from "react";
import PostCreation from "./PostCreation";
import TwitterFeed from "./Twitterfeed";

const Maincontent = () => {
    const [activeTab, setActiveTab] = useState('you');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (

<div className="flex-1 h-screen max-w-2xl mx-auto mt-8 ml-64 mr-64">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-around">
            <button
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-white ${activeTab === 'you' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('you')}
            >
              You
            </button>
            <button
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-white ${activeTab === 'following' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange('following')}
            >
              Following
            </button>
          </div>
        </div>
        <PostCreation />
        <div className="p-4 space-y-4">
          {activeTab === 'you' && (
            <TwitterFeed />
          )}
          {activeTab === 'following' && (
            <div className="space-y-4">
              <div className="bg-white shadow-md rounded-lg p-4 flex gap-4">
                <img
                  alt="Post Thumbnail"
                  className="w-16 h-16 rounded-md object-cover"
                  src="/placeholder.svg"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">New blog post from @shadcn</h3>
                  <p className="text-sm text-gray-500">Check out the latest blog post from Shadcn, covering the latest trends in web development.</p>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 flex gap-4">
                <img
                  alt="Post Thumbnail"
                  className="w-16 h-16 rounded-md object-cover"
                  src="/placeholder.svg"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Acme Inc launches new product</h3>
                  <p className="text-sm text-gray-500">Acme Inc has just announced the release of their latest product. Looks like an exciting new addition to their lineup.</p>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 flex gap-4">
                <img
                  alt="Post Thumbnail"
                  className="w-16 h-16 rounded-md object-cover"
                  src="/placeholder.svg"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Design tips from @janedoe</h3>
                  <p className="text-sm text-gray-500">Jane Doe shares her top design tips and tricks. A must-read for anyone looking to improve their design skills.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    );
}

export default Maincontent