import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import userModel from '../Models/userAuthModel.js';
import mongoose from 'mongoose';
import path from 'path';
import url from 'url';
import multer from 'multer';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import { extractUserId} from '../MiddleWare/middleWares.js'
import fs from 'fs';

const router = express.Router();

router.use(cookieParser());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadedFiles/'); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
        const token = req.cookies.isLoggedIn;
        console.log(token);
        if (!token) {
            return cb(new Error("Authentication token is missing!"));
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        if (!decodedToken) {
            return cb(new Error("Please login and try again! (JWT Mismatch)"));
        }
        const date = new Date();
        const userId = decodedToken._id;
        const ext = path.extname(file.originalname);
        const newFilename = `profilepicture_${userId}${ext}`;
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const findProfilePicture = (userId) => {
    // Define the profile picture directory
    const profilePicDir = path.join(__dirname, '../uploadedFiles');
  
    // Read all files in the directory
    const files = fs.readdirSync(profilePicDir);
  
    // Find the file that matches the user ID pattern
    const profilePicture = files.find(file => file.startsWith(`profilepicture_${userId}`));
  
    if (!profilePicture) {
      console.log('Profile picture not found!');
      return null;
    }
  
    // Return the full path of the profile picture
    const filePath = path.join(profilePicDir, profilePicture);
    const fileName = path.basename(filePath)
    console.log('Profile picture found:', fileName);
    return fileName;
  };

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.json({ status: false, message: "Please provide all required fields." });
        }

        // Check for existing user
        const alreadyExists = await userModel.findOne({ email: email });
        if (alreadyExists) {
            return res.json({ status: false, message: "User already exists!" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashPassword
        });

        // Save user to database
        await newUser.save();

        // Create a new collection for the user
        const userCollectionName = `collection_${newUser._id}`;
        await mongoose.connection.db.createCollection(userCollectionName);

        return res.json({ status: true, message: "Your registration was successful!" });
    } catch (err) {
        if (err.code == 11000) {
            return res.json({ status: false, message: "User already exists!" });
        }
        return res.json({ status: false, message: err.message });
    }
});


router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.json({ status: false, message: "Please provide both email and password." });
        }

        // Check if user exists
        const userExists = await userModel.findOne({ email: email });
        if (!userExists) {
            return res.json({ status: false, message: "User not found! Please sign up first!" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, userExists.password);
        if (!passwordMatch) {
            return res.json({ status: false, message: "Wrong email or password!" });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: userExists._id }, process.env.JWT_KEY, { expiresIn: '24h' });

        // Set cookie with token
        res.cookie('isLoggedIn', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // Example: 1 day

        // Access user's unique database
        const dbName = `user_${userExists._id}`; // Assuming the user-specific database is named using the user ID
        const userDbConnection = mongoose.connection.useDb(dbName);

        // Optionally, store the connection in the request object or session
        req.userDb = userDbConnection;

        return res.json({ status: true, message: "You logged in successfully!" });
    } catch (err) {
        return res.json({ status: false, message: err.message });
    }
});

// Forgot password route
router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const userExists = await userModel.findOne({ email: email });
        if (!userExists) {
            return res.json({ status: false, message: "User does not exist!" });
        }

        // Generate token for password reset
        const newToken = jwt.sign({ email: userExists.email }, process.env.JWT_KEY, { expiresIn: '5m' });

        // Email configuration
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
            subject: "Reset Password",
            text: `http://localhost:5173/reset/${newToken}`,
        });

        console.log("Message sent: %s", info.messageId);
        return res.json({ status: true, message: "Password reset link sent to your email." });
    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
});

// Reset password route
router.post('/reset/:token', async (req, res) => {
    try {
        const { password, token } = req.body;

        // Verify JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        if (!decodedToken) {
            return res.json({ status: false, message: "Invalid or expired token!" });
        }

        // Hash new password
        const hashPassword = await bcrypt.hash(password, 10);

        // Update user's password
        await userModel.findByIdAndUpdate(decodedToken._id, { password: hashPassword });

        return res.json({ status: true, message: "Password updated successfully!" });
    } catch (err) {
        return res.json({ status: false, message: err.message });
    }
});

// Verify route


router.get('/verify', async (req, res) => {
    try {
        console.log("get verify")
        const token = req.cookies.isLoggedIn;
        if (!token) {
            return res.json({ status: false, message: "Please login and try again!(No token)" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        if (!decodedToken) {
            return res.json({ status: false, message: "Please login and try again!(JWT Mismatch)" });
        }
        const user = await userModel.findById(decodedToken._id);
        if (!user) {
            return res.json({ status: false, message: "User does not exist!" });
        }
        return res.json({ status: true, message: "User authorized!", details: { username: user.username, email: user.email, bio: user.profile.bio, phoneNumber: user.profile.phoneNumber}, settings:{theme:user.settings.theme, autoSave: user.settings.autoSave, lang: user.settings.lang, emailUpdate:user.settings.emailUpdate, twoFactorAuth:user.settings.twoFactorAuth}, profile: {
            profilePicture: user.profile.profilePicture
        }});
    }
    catch (err) {
        console.log(err);
        return res.json({ status: false, message: err.message });
    }
});



router.post('/updateProfile', async (req, res) => {
    try {
        console.log('Updating profile');
        const token = req.cookies.isLoggedIn;
        if (!token) {
            return res.json({ status: false, message: 'Authentication token is missing!' });
        }

        const { bio, phoneNumber } = req.body;
        console.log(bio, phoneNumber);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        // Find and update the user profile
        const user = await userModel.findByIdAndUpdate(
            decodedToken._id,
            {
                profile: {
                    phoneNumber: phoneNumber, bio: bio
                }
            }
        );
        console.log("User updated!")
        if (!user) {
            return res.json({ status: false, message: 'User not found!' });
        }

        return res.json({
            status: true,
            message: 'Profile Updated Successfully!',
            details: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                phoneNumber: user.phoneNumber,
            }
        });
    } catch (err) {
        console.error(err);
        return res.json({ status: false, message: err.message });
    }
});

router.post('/updateSettings', async (req, res) => {
    try {
        console.log('Updating settings');
        const token = req.cookies.isLoggedIn;
        if (!token) {
            return res.json({ status: false, message: 'Authentication token is missing!' });
        }
        const { username, theme, autoSave, lang, emailUpdate, twoFactorAuth } = req.body;
        console.log(username ,theme, autoSave, lang, emailUpdate, twoFactorAuth);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        
        // Find and update the user settings
        const user = await userModel.findByIdAndUpdate(
            decodedToken._id,
            {
                settings: {
                    theme: theme,
                    autoSave: autoSave,
                    lang: lang,
                    emailUpdate: emailUpdate,
                    twoFactorAuth: twoFactorAuth
                }
            }
        );
        console.log("Settings updated!")
        if (!user) {
            return res.json({ status: false, message: 'User not found!' });
        }
        return res.json({ status: true, message: 'Settings updated!' , settings:{
            theme: user.settings.theme,
            autoSave: user.settings.autoSave,
            lang: user.settings.lang,
            emailUpdate: user.settings.emailUpdate,
            twoFactorAuth: user.settings.twoFactorAuth
        }});
        
    } catch (err) {
        console.error(err);
        return res.json({ status: false, message: err.message });
    }
});

router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('isLoggedIn');
        return res.json({ status: true, message: "You have been logged out successfully!" });
    }
    catch (err) {
        return res.json({ status: false, message: err.message });
    }
});

router.get('/delete', async (req, res) => {
    try {
        const token = req.cookies.isLoggedIn;
        if (!token) {
            return res.json({ status: false, message: 'User does not exist!' });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            return res.json({ status: false, message: 'Invalid token!' });
        }

        const user = await userModel.findById(decodedToken._id);
        if (!user) {
            return res.json({ status: false, message: 'User does not exist!' });
        }

        await userModel.findByIdAndDelete(decodedToken._id);
        const collectionName = `collection_${decodedToken._id}`

        await mongoose.connection.db.dropCollection(collectionName);
        const collections = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();
        if (collections.length > 0) {
            await mongoose.connection.db.dropCollection(collectionName);
            console.log(`Collection '${collectionName}' dropped successfully.`);
        } else {
            console.log(`Collection '${collectionName}' does not exist.`);
        }
        res.clearCookie('isLoggedIn');
        

        return res.json({ status: true, message: 'User deleted!' });

    } catch (error) {
        console.error(error);
        return res.json({ status: false, message: 'Internal server error' });
    }
});


router.post('/uploadProfilePic', extractUserId, upload.single('uploaded_file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ status: false, message: 'No file uploaded!' });
        }
        const token = req.cookies.isLoggedIn;
        if (!token) {
            return res.json({ status: false, message: 'Authentication token is missing!' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        // Your logic to update user profile with the new filename
        const user = await userModel.findById(decodedToken._id);
        if (!user) {
            return res.json({ status: false, message: 'User not found!' });
        }

        user.profile.profilePicture = true;
        await user.save();

        return res.json({
            status: true,
            message: 'Profile picture uploaded successfully!',
        });
    } catch (err) {
        console.error(err);
        return res.json({ status: false, message: err.message });
    }
});


router.get('/profilepic',async (req, res)=>{
    try {
        const token = req.cookies.isLoggedIn;
        if (!token) {
            return res.json({ status: false, message: 'Unauthorized!' });
        }
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            return res.json({ status: false, message: 'Invalid token!' });
        }

        const user = await userModel.findById(decodedToken._id);
        if (!user) {
            return res.json({ status: false, message: 'User does not exist!' });
        }
        
        const url = findProfilePicture(decodedToken._id);
        console.log(url);
        const profilepic = path.join(__dirname, '../uploadedFiles',`${url}`)
        console.log("file sent!")
        res.sendFile(profilepic)
    }
    catch (error) {
        console.error(error);
        return res.json({ status: false, message: 'Internal server error' });
    }
});

export { router as userAuthRouter };
