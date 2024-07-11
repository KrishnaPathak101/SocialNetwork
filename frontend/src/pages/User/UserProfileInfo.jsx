// src/Components/UserProfileInfo.js
import React from 'react';
import FollowButton from './FollowButton'
import UserWebsite from './Userwebsite';

const UserProfileInfo = ({ fullName,website,userId,  username, bio, isCurrentUser, onEditProfile }) => (
  <>
  <div className="flex justify-between  items-center">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{fullName}</h1>
      <p className="text-gray-500 dark:text-gray-400">@{username}</p>
    </div>
    <div>
    <FollowButton
      isCurrentUser={isCurrentUser}
      onClick={onEditProfile}
      userId={userId}
    />
    
    </div>
  </div>
  <div>
    <p className=' text-white'>{bio}</p>
  </div>
  <div>
    <UserWebsite website={website} />
  </div>
  </>
);

export default UserProfileInfo;
