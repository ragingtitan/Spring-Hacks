import mongoose  from "mongoose";


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    profile:{
        profilePicture:{
            type: Boolean,
            default:false
        },

        bio: {
            type: String,
            default:""
        },
    
        phoneNumber: {
            type: Number,
            default: null
        },
        
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
      
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    settings:{
        theme:{
            type: Boolean,
            default: false
        },
        autoSave:{
            type: Boolean,
            default: true
        },
        lang:{
            type: String,
            default: "en"
        },
        emailUpdate:{
            type: Boolean,
            default: true
        },
        twoFactorAuth:{
            type: Boolean,
            default: false
        }
    }
});

const userModel = mongoose.model('Auth',userSchema);
export default userModel;
