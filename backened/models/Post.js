import mongoose from 'mongoose';

// Define the Comment Schema separately for better structure and reuse
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 500,  // Example validation: max length of 500 characters
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }  // Disable _id for subdocuments to avoid unnecessary overhead
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,  // Add index for better performance
    },
    text: {
      type: String,
      maxlength: 2000,  // Example validation: max length of 2000 characters
    },
    img: {
      type: String,
      validate: {
        validator: function (v) {
          // Allow null or undefined values
          if (v === null || v === undefined) return true;
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(v);  // Simple URL validation for image
        },
        message: props => `${props.value} is not a valid image URL!`
      },
      default: null,  // Set default value to null
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],  // Use the defined comment schema
  },
  { timestamps: true }
);

// Add index on likes array for better performance on querying
postSchema.index({ likes: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
