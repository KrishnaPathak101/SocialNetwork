// src/EditProfileModal.js
import React, { useState } from 'react';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, user, updateUser }) => {
  const [bio, setBio] = useState(user.bio);
  const [website, setWebsite] = useState(user.website);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('website', website);
    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/profile/edit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      updateUser(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-700 dark:text-gray-300">&times;</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Bio</label>
            <textarea
              className="w-full mt-1 p-2 border rounded"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Website</label>
            <input
              type="url"
              className="w-full mt-1 p-2 border rounded"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Profile Picture</label>
            <input
              type="file"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) => setProfilePictureFile(e.target.files[0])}
            />
            {profilePicture && (
              <img src={profilePicture} alt="Profile" className="w-20 h-20 rounded-full mt-2" />
            )}
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
