<<<<<<< HEAD
import React, { useContext,useState } from 'react';
=======
import React, { useContext } from 'react';
>>>>>>> origin/main
import { Link } from 'react-router-dom';
import { UserContext } from '../../useContext';

const FollowButton = ({ onClick, isCurrentUser, userId }) => {
<<<<<<< HEAD
  const {user, } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const toggleFollow = async (userId, isFollowing) => {

=======
  const {user} = useContext(UserContext);
  const toggleFollow = async (userId, isFollowing) => {
>>>>>>> origin/main
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await axios.post(`https://socialnetwork-zqhn.onrender.com/${endpoint}`, { userIdfu: userId }, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
<<<<<<< HEAD
    } finally {
      setLoading(false);
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
 <>
   { !loading && (
    <Link onClick={isCurrentUser ? onClick : () => {toggleFollow(userId, user.following)}} className="px-4 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600">
      {isCurrentUser ? 'Edit Profile' : user.following ? 'Unfollow' : 'Follow'}
    </Link>
    )
    }
      { loading  && (
    <div  className="px-4 py-2  skeleton  rounded-full  ">
      
    </div>
    )
    }
 </>

=======
    <Link onClick={isCurrentUser ? onClick : () => {toggleFollow(userId, user.following)}} className="px-4 py-2 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600">
      {isCurrentUser ? 'Edit Profile' : user.following ? 'Unfollow' : 'Follow'}
    </Link>
>>>>>>> origin/main
  );
};

export default FollowButton;
