import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }       
}; 
export default connectToDatabase