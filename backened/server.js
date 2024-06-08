import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from './db/DatabaseCon.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken'
import Post from './models/Post.js';
import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from "cloudinary";
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

const PORT = process.env.PORT || 4000;
const app = express();
const JWT_Secret = process.env.JWT_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
console.log('CLOUDINARY_CLOUD_NAME:', CLOUDINARY_CLOUD_NAME); // Ensure the JWT_SECRET is loaded


app.use(cors({
    origin: ['http://localhost:5173','https://socialnetwork-frontend-u1b0.onrender.com','https://social-network-amber.vercel.app', 'http://localhost:3000', 'http://localhost:4000', 'http://localhost:3000/api'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());




cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to verify JWT and set req.user
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_Secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    req.user = decoded.user;
    next();
  });
};

// Rate limiter middleware
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
      status: 'error',
      message: 'Too many requests, please try again later'
  }
});

app.use(generalRateLimiter);
// Rate limiter middleware for post creation
const postRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // limit each user to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many posts created from this IP, please try again after a minute'
  }
});


	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// app.get("*", (req, res) => {
	// 	res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	// });


// uploading profilepicture
app.post('/profilepicture', authenticateToken, async (req, res) => {

  try {
    let profilepicture = req.body.image;
    console.log(profilepicture)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    if (profilepicture) {
			const uploadedResponse = await cloudinary.uploader.upload(profilepicture);
      profilepicture = uploadedResponse.secure_url;
		}
    user.profileImg = profilepicture;
    await user.save();
    res.status(200).json({ status: 'success', message: 'Profile picture uploaded successfully' });
  } catch (error) { 
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ status: 'error', message: 'Error uploading profile picture' });
  }
});

app.get('/', authenticateToken, async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_Secret);
    const loggedInUserId = decoded.user._id;

    const users = await User.find();
    const usersWithFollowStatus = users.map(user => ({
      ...user.toObject(),
      isFollowing: user.followers.includes(loggedInUserId)
    }));

    res.status(200).json(usersWithFollowStatus);
  } catch (error) {
    console.log("Error in get", error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

app.get('/other/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  console.log( "userId",userId)
  try {
    // Check if the user exists
    if(!userId) {
      return res.status(400).json({ status: 'error', message: 'Invalid user ID' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching user' });
  }
} )

app.post('/posts/comment', authenticateToken, async (req, res) => {
  const { postId, text } = req.body;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_Secret);
    const userId = decoded.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    const comment = {
      user: userId,
      text: text,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Populate the user field of the newly added comment
    const populatedPost = await Post.findById(postId).populate('comments.user');
    const newComment = populatedPost.comments.slice(-1)[0]; // Get the last added comment

    res.status(201).json({ status: 'success', data: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ status: 'error', message: 'Error adding comment' });
  }
});

// Applying rate limiter and validation to other endpoints
app.post('/signup', [
  body('username').notEmpty().withMessage('Username is required'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { username, fullName, email, password } = req.body;
  try {
      const user = new User({ username, fullName, email, password: bcrypt.hashSync(password, 10) });
      await user.save();
      res.status(200).json({ status: 'success', message: 'Signup successful' });
  } catch (error) {
      console.log("Error in signup", error);
      res.status(500).json({ status: 'error', message: 'Signup failed' });
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // find user in database
        const user = await User.findOne({ email: email, password: password });

        if (user) {
            const token = jwt.sign({ user: user }, JWT_Secret, { expiresIn: '15d' });
            res.cookie('token', token, { secure: true,
                    httpOnly: true,
                    sameSite: 'None' });
            return res.status(200).json({ status: 'success', message: 'Login successful' }); // Respond with success message
        } else {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' }); // Respond with error message
        }
    } catch (error) {
        console.log("Error in login", error);
        return res.status(500).json({ status: 'error', message: 'Login failed' }); // Respond with error message
    }
});
app.get('/profile', authenticateToken, async(req, res) => {
    const token = req.cookies.token;
    try {
        if(!token) {
            res.json(null);
        } else {
            jwt.verify(token, JWT_Secret, async(err, decoded) => {
                if(err) {
                    res.json(null);
                } else {
                    const user = await User.findById(decoded.user._id).select('-password');
                    res.status(200).json(user);
                }
            });
        }

    } catch (error) {
        console.log("error in profile request", error)
    }
});

// Apply rate limiter to the post creation route
app.post('/post', authenticateToken, postRateLimiter, async (req, res) => {
  let { user, text, image } = req.body;
  if (!user || !text) {
    return res.status(400).json({ status: 'error', message: 'User and text are required' });
  }
  if (image) {
    const uploadedResponse = await cloudinary.uploader.upload(image);
    image = uploadedResponse.secure_url;
  }
  try {
    const newPost = new Post({
      user,
      text,
      img: image
    });

    await newPost.save();
    res.status(201).json({ status: 'success', data: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ status: 'error', message: 'Error creating post' });
  }
});

  app.post('/posts/like', authenticateToken, async (req, res) => {
    const { postId } = req.body;
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_Secret);
      const userId = decoded.user._id;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ status: 'error', message: 'Post not found' });
      }
  
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
      } else {
        post.likes = post.likes.filter(id => id.toString() !== userId);
      }
  
      await post.save();
      res.status(200).json({ status: 'success', message: 'Post liked/unliked successfully', likes: post.likes.length });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      res.status(500).json({ status: 'error', message: 'Error liking/unliking post' });
    }
  });
  
  app.post('/posts/unlike', authenticateToken, async (req, res) => {
    const { postId } = req.body;
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_Secret);
      const userId = decoded.user._id;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ status: 'error', message: 'Post not found' });
      }
  
      if (post.likes.includes(userId)) {
        // Remove userId from likes array
        post.likes = post.likes.filter(id => id.toString() !== userId);
      } else {
        // Add userId to likes array
        post.likes.push(userId);
      }
  
      await post.save();
      res.status(200).json({ status: 'success', message: 'Post liked/unliked successfully', likes: post.likes.length });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      res.status(500).json({ status: 'error', message: 'Error liking/unliking post' });
    }
  });
  
  

  app.get('/posts/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    try {
        // Check if the user is logged in
        const token = req.cookies.token;
        if (!token) {
            // Return an empty array or an appropriate response indicating the user is not logged in
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        const user = await User.findById(userId).populate('following');
        const followingIds = user.following.map(f => f._id);
        const allUserIds = [userId, ...followingIds];
        
        // If the user is logged in, proceed to fetch posts
        const posts = await Post.find({ user: { $in: allUserIds } }).sort({ createdAt: -1 }).populate({ 
          path: 'comments',
          populate: {
            path: 'user',
            model: 'User'
          }
        }).populate('user');
        if (!posts) {
            return res.status(200).json([]); // Return an empty array if no posts found
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching posts' });
    }
});

app.get('/post/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  try {
      // Check if the user is logged in
      const token = req.cookies.token;
      if (!token) {
          // Return an empty array or an appropriate response indicating the user is not logged in
          return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }
      
      // If the user is logged in, proceed to fetch posts
      const posts = await Post.find({user: userId}).sort({ createdAt: -1 }).populate('user');
      if (!posts) {
          return res.status(200).json([]); // Return an empty array if no posts found
      }
      res.status(200).json(posts);
  } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ status: 'error', message: 'Error fetching posts' });
  }
});

app.post('/api/follow', authenticateToken, async (req, res) => {
  const { userIdfu } = req.body;
  const token = req.cookies.token;

  try {
    const userId = jwt.verify(token, JWT_Secret).user;
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userIdfu);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.following.includes(userIdfu)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    // Follow the user
    user.following.push(userIdfu);
    userToFollow.followers.push(userId);

    await user.save();
    await userToFollow.save();

    res.status(200).json({ message: 'User followed successfully', isFollowing: true });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Error following user', error });
  }
});
app.post('/api/unfollow', authenticateToken, async (req, res) => {
  const { userIdfu } = req.body;
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, JWT_Secret);
    const userId = decoded.user._id;
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userIdfu);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.following.includes(userIdfu)) {
      // Unfollow the user
      user.following = user.following.filter(id => id.toString() !== userIdfu);
      userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

      await user.save();
      await userToUnfollow.save();

      res.status(200).json({ message: 'User unfollowed successfully', isFollowing: false });
    } else {
      return res.status(400).json({ message: 'You are not following this user' });
    }
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Error unfollowing user', error });
  }
});
    // Example backend routes
    app.get('/api/following/:userId', authenticateToken, async (req, res) => {
      const userId = req.params.userId;
      try {
        const user = await User.findById(userId).populate('following');
        if (user && user.following) {
          res.json(user.following);
        } else {
          res.json([]); // Send an empty array if user or following is not found
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching following users', error: error.toString() });
      }
    });
  
  app.get('/api/followers/:userId', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate('followers');
      res.json(user.followers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching followers', error });
    }
  });
  
  // Delete a post
app.delete('/posts/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ status: 'error', message: 'Error deleting post' });
  }
});

// edit user data
app.post('/api/profile/edit', authenticateToken, async (req, res) => {
  const { bio, website } = req.body;
  try {
    const updateData = { bio, website };
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile', error);
    res.status(500).json({ status: 'error', message: 'Profile update failed' });
  }
});

// Edit a post
app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    }

    post.text = text;
    post.updatedAt = new Date();
    await post.save();

    res.status(200).json({ status: 'success', message: 'Post updated successfully', data: post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ status: 'error', message: 'Error updating post' });
  }
});

  app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ status: 'success', message: 'Logout successful' });
  });

  
   
  
app.listen(PORT, () => {
    connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
})
