import jwt from 'jsonwebtoken';
import { JWT_Secret } from '../utils/constants.js';

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

export default authenticateToken;
