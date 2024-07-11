import React, { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
<<<<<<< HEAD
//props coming from Profile.jsx
const UserCoverPhoto = ({ loading, defaultCoverPhoto, profilePicture, defaultProfilePicture, userId }) => {
=======

const UserCoverPhoto = ({ defaultCoverPhoto, profilePicture, defaultProfilePicture, userId }) => {
>>>>>>> origin/main
  const [uploadedCoverPhoto, setUploadedCoverPhoto] = useState(() => {
    const storedCoverPhoto = localStorage.getItem('coverPhoto');
    return storedCoverPhoto ? storedCoverPhoto : defaultCoverPhoto;
  });

  const [uploadedProfilePicture, setUploadedProfilePicture] = useState(() => {
    const storedProfilePicture = localStorage.getItem('profilePicture');
    return storedProfilePicture ? storedProfilePicture : defaultProfilePicture;
  });

  useEffect(() => {
    localStorage.setItem('coverPhoto', uploadedCoverPhoto);
  }, [uploadedCoverPhoto]);

  useEffect(() => {
    localStorage.setItem('profilePicture', uploadedProfilePicture);
  }, [uploadedProfilePicture]);

  const handleCoverPhotoUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUploadedCoverPhoto(reader.result);
    };
  };
  
  useEffect(() => {
    console.log("profile pircture", profilePicture)
  }, [profilePicture])

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUploadedProfilePicture(reader.result);
    };
  };

  return (
    <div className="relative">
      <label htmlFor="coverPhotoUpload" className="cursor-pointer">
        <img src={uploadedCoverPhoto} alt="Cover" className="w-full h-48 object-cover" />
        <input
          type="file"
          id="coverPhotoUpload"
          accept="image/*"
          className="hidden"
          onChange={handleCoverPhotoUpload}
        />
      </label>
      <div className="absolute  bottom-[-70px] left-2">
        <label htmlFor="profilePictureUpload" className="cursor-pointer">
<<<<<<< HEAD
          <UserAvatar src={uploadedProfilePicture} loading={loading} profilePicture={profilePicture} userId={userId} alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-white" />
=======
          <UserAvatar src={uploadedProfilePicture} profilePicture={profilePicture} userId={userId} alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-white" />
>>>>>>> origin/main
     
        </label>
      </div>
    </div>
  );
};

export default UserCoverPhoto;
