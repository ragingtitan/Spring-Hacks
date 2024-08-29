import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userModel from '../Models/userAuthModel.js'
import axios from 'axios';
import nodemailer from 'nodemailer';


const router = express.Router();

router.post('/response', async (req, res) => {
    try {
        const token = req.cookies.isLoggedIn;
        if (!token) {
            return res.json({ status: false, message: 'Authentication token is missing!' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        if (!decodedToken) {
            return res.json({ status: false, message: "Please login and try again! (JWT Mismatch)" });
        }

        const user = await userModel.findById(decodedToken._id);
        if (!user) {
            return res.json({ status: false, message: "User does not exist!" });
        }

        // Make the external API call
        const url = "http://localhost:5000/summarize";
        const response = await axios.post(url, { prompt: req.body.prompt });

        // Create the document to be stored
        const document = {
            user: user._id,
            prompt: req.body.prompt,
            response: response.data.summary,
            timestamp: new Date()
        };

        // Access the user's specific collection
        const userCollectionName = `collection_${user._id}`;
        const db = mongoose.connection;
        await db.collection(userCollectionName).insertOne(document);

        const userEmail = await userModel.findById(decodedToken._id);
        const email = userEmail ? userEmail.email : null;

        if(userEmail.settings.emailUpdate)
        {
            console.log("Send email!")
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASS,
                },
            });
    
            // Send password reset link
            const info = await transporter.sendMail({
                from: process.env.USER_EMAIL,
                to: email,
                subject: "You made new notes",
                html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
    </head>
    <body class="bg-gray-100">
        <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="bg-blue-600 text-white p-6 text-center text-2xl font-bold">
                Your Requested Information
            </div>
            <div class="p-6">
                <p class="text-gray-700 text-base mb-4">
                    Dear ${userEmail.username},
                </p>
                <p class="text-gray-700 text-base mb-4">
                   Here is the text you entered:
                </p>
                <div class="bg-gray-100 border border-gray-300 p-4 rounded-lg mb-4">
                    <div class="text-gray-800">${req.body.prompt}</div>
                </div>
                <p class="text-gray-700 text-base mb-4">
                    To explore more and access your notes, please click the link below:
                </p>
                <a href="http://localhost:5173/" class="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg text-base font-medium hover:bg-blue-700">
                    Go to site
                </a>
            </div>
            <div class="bg-gray-200 text-gray-600 text-center py-4 text-sm">
                <p>
                    If you have any further questions or need additional assistance, feel free to reply to this email.
                </p>
                <p class="mt-2">
                    Best regards,<br>
                    Anish<br>
                    admin<br>
                    Notes Maker AI<br>
                    anishdas506@gmail.com<br>
                </p>
            </div>
        </div>
    </body>
    </html>
    `
    
            });
    
            console.log("Message sent: %s", info.messageId);
        }
        else{
            console.log("Email update is disabled for this user");
        }
        
        // Send the response back to the user
        res.json({ prompt: req.body.prompt, response: response.data.summary, status: true });
    } catch (err) {
        res.json({ message: err.message, status: false });
    }
});


router.get('/prevSummarization', async (req, res) => {
    try {
        // Check for the presence of a token
        const token = req.cookies.isLoggedIn;
        if (!token) {
            return res.json({ status: false, message: 'Authentication token is missing!' });
        }

        // Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        if (!decodedToken) {
            return res.json({ status: false, message: "Please login and try again! (JWT Mismatch)" });
        }

        // Find the user in the database
        const user = await userModel.findById(decodedToken._id);
        if (!user) {
            return res.json({ status: false, message: "User does not exist!" });
        }

        // Access the user's specific collection
        const userCollectionName = `collection_${user._id}`;
        const db = mongoose.connection.db;
        const prevSummarizations = await db.collection(userCollectionName).find({}).toArray();

        // Return the previous summarizations
        return res.json({ status: true, prevChat: prevSummarizations });
    } catch (err) {
        return res.json({ status: false, message: err.message });
    }
});


export { router as userAppRouter };