import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../useContext';
import axios from 'axios';
import profile from '../assets/profile.jpg';

import { Link } from 'react-router-dom';

const UsersToFollow = () => {
  const [usersToFollow, setUsersToFollow] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000', {
          withCredentials: true,
        });

        const data = response.data;
        const filteredUsers = data.filter(fetchedUser => fetchedUser._id !== user._id);
        console.log("Fetched users:", filteredUsers); // Debugging line

        // Determine follow status based on the logged-in user's following array
        const usersWithFollowStatus = filteredUsers.map(fetchedUser => ({
          ...fetchedUser,
          isFollowing: user.following.includes(fetchedUser._id)
        }));

        setUsersToFollow(usersWithFollowStatus);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`http://localhost:4000/${endpoint}`, { userIdfu: userId }, {
        withCredentials: true,
      });

      setUsersToFollow(prevUsers =>
        prevUsers.map(fetchedUser =>
          fetchedUser._id === userId
            ? { ...fetchedUser, isFollowing: !isFollowing }
            : fetchedUser
        )
      );
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
    }
  };

  if (user === null) {
    return (
      <div className="w-64 border-l border-gray-200 dark:border-gray-800 p-4 fixed h-full right-0">
        <h2 className="text-lg text-white font-semibold">Login</h2>
        <div className="mt-4">
          <p className="text-gray-400">Please login to see users to follow.</p>
          <a href="/login" className="w-full text-center mt-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 p-4 fixed border border-gray-700 dark:border-gray-800 right-4 rounded-xl">
      <h2 className="text-lg text-white font-semibold">You Might Follow</h2>
      <div className="mt-4 space-y-4">
        {usersToFollow.map((userToFollow) => (
          <div key={userToFollow._id} className="flex items-center space-x-4">
           <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 mr-3">
            <img
              src={userToFollow.profileImg || profile}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
            <div>
              <Link to={`/profile/${userToFollow._id}`} className="text-sm font-medium text-gray-900 dark:text-white">@{userToFollow.username}</Link>
              <button
                onClick={() => handleFollowToggle(userToFollow._id, userToFollow.isFollowing)}
                className={`text-xs ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 w-16 rounded ${userToFollow.isFollowing ? 'text-red-500' : 'text-blue-500'}`}
              >
                {userToFollow.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersToFollow; 