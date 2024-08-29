import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userAuthRouter } from './Routes/userAuthRoutes.js';
import { userAppRouter } from './Routes/userAppRoutes.js';
const app = express();
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));

dotenv.config({path: 'secrets.env'});

app.use(express.json());
app.use(cookieParser());
app.use('/auth',userAuthRouter);
app.use('/app',userAppRouter);
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});