import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    password: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        trim: true,
    },     
}, {
    timestamps: true,
}); 

const User = mongoose.model('User', userSchema);

export default User;