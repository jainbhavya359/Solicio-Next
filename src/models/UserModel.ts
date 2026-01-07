import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyToken: {
        type: String,
        default: undefined
    },
    verifyTokenExpiry: {
        type: Date,
        default: undefined
    },
    forgotPasswordToken: {
        type: String,
        default: undefined
    },
    forgotPasswordTokenExpiry: {
        type: Date,
        default: undefined
    }
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;