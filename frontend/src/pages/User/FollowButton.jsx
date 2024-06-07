import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../useContext';

const FollowButton = ({ onClick, isCurrentUser, userId }) => {
  const {user} = useContext(UserContext);
  const toggleFollow = async (userId, isFollowing) => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`https://socialnetwork-zqhn.onrender.com/${endpoint}`, { userIdfu: userId }, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
    }
  };
  if(user){
    console.log("isFollowing", user)
  }else {
    console.log("notFollowing", user)
  }


  if (isCurrentUser) {
    console.log("currentUser", isCurrentUser)
  } else {
    console.log("notCurrentUser", isCurrentUser)
  }
  return (
    <Link onClick={isCurrentUser ? onClick : () => {toggleFollow(userId, user.following)}} className="px-4 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600">
      {isCurrentUser ? 'Edit Profile' : user.following ? 'Unfollow' : 'Follow'}
    </Link>
  );
};

export default FollowButton;
