// src/Components/UserListModal.js
import React from 'react';
import image from '../../assets/profile.jpg';
const UserListModal = ({ isOpen, onClose, modalType, modalUsers }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {modalType === "following" ? "Following" : "Followers"}
          </h2>
          <button onClick={onClose} className="text-gray-700 dark:text-gray-300">&times;</button>
        </div>
        <div className="space-y-4">
          {Array.isArray(modalUsers) && modalUsers.map((modalUser) => (
            <div key={modalUser._id} className="flex items-center space-x-4">
              <img
                src={modalUser.profileImg || image}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">@{modalUser.username}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{modalUser.fullName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
