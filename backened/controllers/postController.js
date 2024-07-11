import Post from '../models/Post.js';
import { v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
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
};

export const likePost = async (req, res) => {
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
};

export const getPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        const user = await User.findById(userId).populate('posts').exec();

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const posts = await Post.find({ user: user._id });
        res.status(200).json({ status: 'success', data: posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching posts' });
    }
};
