import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true // Ensure usernames are unique
        },
        fullName: {
            type: String,
            trim: true // Trim whitespace from the name
        },
        email: {
            type: String,
            trim: true,
            lowercase: true, // Ensure email is stored in lowercase
            unique: true, // Ensure email is unique
            match: [/\S+@\S+\.\S+/, 'is invalid'] // Basic email validation
        },
        profileImg: {
			type: String,
			default: "",
		},
		coverImg: {
			type: String,
			default: "",
		},
        bio: {
            type: String,
            maxlength: 500 // Limit bio length
        },
        website: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'is invalid'] // Basic URL validation
        },
        password: {
            type: String,
            required: true,
        },
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    { timestamps: true }
);

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;
