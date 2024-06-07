import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../useContext';
import profile from '../assets/profile.jpg';

const PostCreation = ({ darkMode }) => {
  const [postData, setPostData] = useState('');
  const [image, setImage] = useState(null); // State to store selected image
  const { user } = useContext(UserContext);

  const handleSendingData = async (e) => {
    if (!postData) return alert("Please enter some text to post");
    if (!user) return alert("Please login first");
    
    e.preventDefault();
    
    try {
      const res = await axios.post(
        'http://localhost:4000/post', 
        { user: user?._id, text: postData, image: image }, 
        { withCredentials: true }
      );
  
      if (res.data.status === 'success') {
        alert("Post created successfully");
        window.location.reload();
      } else if (res.data.message === 'Too many posts created from this IP, please try again after a minute') {
        alert(res.data.message);
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        console.error("Post sending error", error);
        alert("An error occurred while creating the post");
      }
    }
  };

  const handleImageChange = (e) => {
    if (user) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  } else {
    alert("Please login first")
  }
    
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <form onSubmit={handleSendingData} className={`bg-black p-4 border-b border-gray-200 ${darkMode ? 'dark' : ''}`}>
      <div className="flex items-start">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 mr-3">
            <img
              src={user ? user?.profileImg : profile}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        <div className="flex-1">
          <textarea
            value={postData}
            onChange={(e) => setPostData(e.target.value)}
            className={`w-full h-20 resize-none border-none outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-transparent text-white'} text-lg`}
            placeholder="What's happening?"
          />
             {image && (
                <div className="mb-2">
                  <img src={image} alt="Selected" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                  <button type="button" onClick={removeImage} className="text-xs text-red-500 mt-1 focus:outline-none">Remove</button>
                </div>
              )}
          <div className="flex justify-between mt-2">
            
            <div className="flex items-center ml-2">
              {/* Image preview */}
           
              {/* Upload button */}
              <label htmlFor="image-upload" className={`bg-blue-500 flex text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 cursor-pointer ${darkMode ? 'dark:bg-gray-700 dark:hover:bg-gray-600' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>          
              </label>
              {/* Input field for image upload */}
              { user && (<input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />)}
            </div>
            <div className="flex">
              <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 ${darkMode ? 'dark:bg-gray-700 dark:hover:bg-gray-600' : ''}`}>
                {user ? 'Post' : "Login First"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostCreation;
