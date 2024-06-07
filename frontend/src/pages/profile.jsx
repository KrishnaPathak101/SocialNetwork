// src/Profile.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../useContext";

import EditProfileModal from "../Components/EditProfileModal";
import UserListModal from "./Modals/UserListModal";
import UserCoverPhoto from "./User/UserCoverPhoto";
import UserProfileInfo from "./User/UserProfileInfo";
import UserStats from "./User/UserStats";
import ProfileTabs from "./User/ProfileTabs";
import TabContent from "./User/TabContent";

const Profile = ({ userId }) => {
  const { user, setUser } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "following" or "followers"
  const [modalUsers, setModalUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('you');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`http://localhost:4000/other/${userId}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUserId();
    } else {
      setProfileData(user);
    }
  }, [userId, user]);

  useEffect(() => {
    console.log("profile img", userId ? profileData?.profileImg : user?.profileImg);
  }, [profileData, userId, user]);
  if (!user) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-500">Please login to view your profile.</p>
      </div>
    );
  }

  const endpoint = userId ? `http://localhost:4000/http://localhost:4000/following/${userId}` : `http://localhost:4000/http://localhost:4000/following/${user._id}`;

  const fetchFollowing = async () => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const data = await response.json();
      setModalUsers(Array.isArray(data) ? data : []);
      setModalType("following");
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching following users:", error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const data = await response.json();
      setModalUsers(Array.isArray(data) ? data : []);
      setModalType("followers");
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditProfile = () => {
    setEditProfileModalVisible(true);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    setProfileData(updatedUser);
  };

  return (
    <div className="dark:bg-black border-r border-b border-l border-gray-700 dark:border-gray-800 flex-1 max-w-2xl mx-auto ml-60 mr-64">
      <UserCoverPhoto
        coverPhoto="/cover-photo.jpg"
        profilePicture={userId ? profileData?.profileImg : user.profileImg}
        userId={userId}
      />
      <div className="p-8 pt-20">
        <UserProfileInfo
          fullName={userId ? profileData?.username : user.username}
          username={userId ? profileData?.username : user.username}
          bio={userId ? profileData?.bio : user.bio}
          website = {userId ? profileData?.website : user.website}
          isCurrentUser={userId === user._id}
          
          onEditProfile={handleEditProfile}
        />
        <UserStats
          followingCount={userId ? profileData?.following.length : user.following.length}
          followersCount={userId ? profileData?.followers.length : user.followers.length}
          onFollowingClick={fetchFollowing}
          onFollowersClick={fetchFollowers}
        />
      </div>
      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <TabContent activeTab={activeTab} userId={userId} />
      <UserListModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        modalType={modalType}
        modalUsers={modalUsers}
      />
      {editProfileModalVisible && (
        <EditProfileModal
          isOpen={editProfileModalVisible}
          onClose={() => setEditProfileModalVisible(false)}
          user={user}
          updateUser={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
