import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../useContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post, darkMode, onLike, onSave, onDelete }) => {
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [saved, setSaved] = useState(post.savedByCurrentUser);
  const [commentModal, setCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedText, setEditedText] = useState(post.text);
  const [edited, setEdited] = useState(false);
 const {user} = useContext(UserContext);
  const toggleCommentModal = () => {
    setCommentModal(!commentModal);
  };

  const toggleEditModal = () => {
    setEditModalVisible(!editModalVisible);
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `http://localhost:4000/posts/${post._id}`,
        { text: editedText },
        { withCredentials: true }
      );
      setEdited(true);
      toggleEditModal();
      window.location.reload()
      setTimeout(() => setEdited(false), 3000); // Reset edited indicator after 3 seconds
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const toggleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    onLike(post._id, newLikedState);

    const url = newLikedState ? 'http://localhost:4000/posts/like' : 'http://localhost:4000/posts/unlike';

    try {
      await axios.post(url, { postId: post._id }, { withCredentials: true });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      setLiked(!newLikedState); // Revert state on error
    }
  };

  const toggleSave = async () => {
    const newSavedState = !saved;
    setSaved(newSavedState);
    onSave(post._id, newSavedState);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      return; // Avoid submitting empty comments
    }

    try {
      const response = await axios.post('http://localhost:4000/posts/comment',
        { postId: post._id, text: comment },
        { withCredentials: true }
      );

      alert("Comment added successfully");
      setComments([...comments, response.data.data]); // Add the new comment to the existing comments
      setComment(''); // Clear the textarea
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/posts/${post._id}`, { withCredentials: true });
      onDelete(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className={`post bg-gray-800 shadow-md rounded-lg p-4 mb-4`}>
      <div className="flex items-center justify-between mb-2">
        {/* username */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 mr-3">
            <img
              src={post.user.profileImg || "/default-profile.jpg"}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <Link to={`/profile/${post.user._id}`} className={`text-lg font-semibold text-white pr-2`}>
            {post.user.username}
          </Link>
          <Link to={`/profile/${post.user._id}`} className='text-gray-500'>
            @{post.user.username}
          </Link>
        </div>
        {/* post options */}
       { user._id === post.user._id && <div className="relative">
          <svg
            onClick={() => setOptionsVisible(!optionsVisible)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="text-white size-6 cursor-pointer"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          {optionsVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Delete
              </button>
              <button
                onClick={toggleEditModal}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Edit
              </button>
            </div>
          )}
        </div>
}
      </div>
      <p className={`text-sm mb-2 text-white`}>{post.text}</p>
     { post.img && <img className="w-full rounded-md h-64 object-cover mb-4" src={post.img} alt="Post image" />}
      <div className="flex justify-between items-center mt-4">
        <button onClick={toggleLike} className="flex items-center">
          {liked || post.likes.length > 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-500">
            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
          </svg>
          
          
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
             <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
            </svg>


          )}
          <span className={`ml-1 text-gray-300`}>{liked || post.likes.length  ? (post.likes.length) : 'Like'}</span>
        </button>
        <button onClick={toggleCommentModal} className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
         <path fillRule="evenodd" d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z" clipRule="evenodd" />
        </svg>

          <span className={`ml-1 text-white`}>Comment ({comments.length})</span>
        </button>
      </div>
      {commentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <p className="text-gray-800">Add a comment</p>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mt-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={handleCommentSubmit}
            >
              Submit
            </button>
            <button
              className="absolute top-0 right-0 p-4 text-gray-500 hover:text-gray-700"
              onClick={() => setCommentModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mt-4">
              <h3 className="text-gray-800">Comments</h3>
              <ul className="mt-2 space-y-2">
                {comments.map((comment, index) => (
                  <li key={index} className="text-gray-700 bg-gray-100 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      {comment.user ? (
                        <>
                          <Link to={`/profile/${comment.user._id}`} className="font-semibold">{comment.user.username}</Link>
                          <span className="text-sm text-gray-600">@{comment.user.username}</span>
                        </>
                      ) : (
                        <span>@</span>
                      )}
                    </div>
                    <p>{comment.text}</p>
                    <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(comment.date))}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {editModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <p className="text-gray-800">Edit your post</p>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mt-2"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows="3"
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={handleEdit}
            >
              Save Changes
            </button>
            <button
              className="absolute top-0 right-0 p-4 text-gray-500 hover:text-gray-700"
              onClick={toggleEditModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TwitterFeed = ({ userpost, userId }) => {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useContext(UserContext);

  const fetchId = userId ? userId : user?._id;

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        return;
      }
      try {
        const endpoint = userpost ? `http://localhost:4000/post/${fetchId}` : `http://localhost:4000/posts/${fetchId}`;
        const response = await fetch(endpoint, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLike = (postId, isLiked) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId ? { ...post, likedByCurrentUser: isLiked } : post
      )
    );
  };

  const handleDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  return (
    <div className={`twitter-feed max-w-xl mx-auto mt-2 ${darkMode ? 'dark' : ''}`}>
      <button onClick={toggleDarkMode} className="mb-4">
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      {posts.map(post => (
        <Post key={post._id} post={post} darkMode={darkMode} onLike={handleLike} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default TwitterFeed;
