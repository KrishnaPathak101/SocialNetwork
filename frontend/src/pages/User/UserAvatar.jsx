import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../useContext';

const UserAvatar = ({ alt, profilePicture, userId }) => {
  const [image, setImage] = useState(profilePicture); // Initialize with profilePicture
  const [tempImage, setTempImage] = useState(null); // Temporary state for previewing image
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsAuthorized(userId === user._id);
  }, [userId, user]);

  const handleImageChange = (e) => {
    if (isAuthorized) {
      const file = e.target.files[0];
      if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        const reader = new FileReader();
        reader.onload = () => {
          setTempImage(reader.result);
          setShowModal(true);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload a PNG or JPG image.');
      }
    } else {
      alert("You are not authorized to perform this action");
    }
  };

  const removeImage = () => {
    if (isAuthorized) {
      setImage(null);
      setTempImage(null);
    } else {
      alert("You are not authorized to perform this action");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthorized && tempImage) {
      try {
        const res = await fetch("https://socialnetwork-zqhn.onrender.com/profilepicture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ image: tempImage }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        setImage(tempImage);
        setTempImage(null);
        alert("Image uploaded successfully");
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("You are not authorized to perform this action");
    }
    setShowModal(false);
  };

  return (
    <div className="relative w-32 h-32">
      <div className="relative w-full h-full rounded-full overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <label
            htmlFor="avatar-upload"
            className="w-full h-full absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <span className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              No Photo
            </span>
          </label>
        )}
        {isAuthorized && (
          <button
            onClick={() => document.getElementById('avatar-upload').click()}
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 19.121a1.5 1.5 0 002.122 0l12-12a1.5 1.5 0 10-2.122-2.122l-12 12a1.5 1.5 0 000 2.122zM4 10V6a2 2 0 012-2h4M14 20h4a2 2 0 002-2v-4"
              />
            </svg>
          </button>
        )}
      </div>
      {isAuthorized && (
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageChange}
          className="hidden"
          id="avatar-upload"
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2"
            >
              &times;
            </button>
            <h2 className="text-lg mb-4">Confirm Profile Picture</h2>
            {tempImage && (
              <img src={tempImage} alt="Preview" className="w-32 h-32 rounded-full mb-4" />
            )}
            <button
              onClick={handleSubmit}
              className="block w-full mb-2 p-2 bg-blue-500 text-white rounded-md"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                removeImage();
              }}
              className="block w-full p-2 bg-red-500 text-white rounded-md"
            >
              Remove Picture
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
