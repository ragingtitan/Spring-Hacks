import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express'
import cookieParser from 'cookie-parser';
const app = express();
 app.use(express.json());
 app.use(cookieParser());
dotenv.config({path:'./secrets.env'})
// Middleware to extract and attach user ID to the request
const extractUserId = (req, res, next) => {
    const token = req.cookies.isLoggedIn;
    if (!token) {
        return res.json({ status: false, message: 'Authentication token is missing!' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decodedToken._id; // Attach user ID to the request object
        next();
    } catch (err) {
        return res.json({ status: false, message: err.message });
    }
};

export  {extractUserId};