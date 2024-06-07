import jwt from 'jsonwebtoken';
import { JWT_Secret } from '../utils/constants.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

export const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, fullName, email, password } = req.body;
    try {
        const user = new User({ username, fullName, email, password});
        await user.save();
        res.status(200).json({ status: 'success', message: 'Signup successful' });
    } catch (error) {
        console.log("Error in signup", error);
        res.status(500).json({ status: 'error', message: 'Signup failed' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });

        if (user) {
            const token = jwt.sign({ user: user }, JWT_Secret, { expiresIn: '15d' });
            res.cookie('token', token, { httpOnly: true });
            return res.status(200).json({ status: 'success', message: 'Login successful' });
        } else {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log("Error in login", error);
        return res.status(500).json({ status: 'error', message: 'Login failed' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ status: 'success', message: 'Logout successful' });
};
