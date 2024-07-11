import rateLimit from 'express-rate-limit';

export const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many requests, please try again later'
    }
});

export const postRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 5, // limit each user to 5 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many posts created from this IP, please try again after a minute'
    }
});
