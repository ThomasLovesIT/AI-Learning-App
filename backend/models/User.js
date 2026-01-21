import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide an username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters or more']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ],
        maxlength: [255, 'Email cannot be longer than 255 characters']
    },
    password: {
        type: String,
        required: [true, 'Please Enter a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    profileImage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});


//Hash Passwords before saving
userSchema.pre('save', async function() { // <--- 1. Remove 'next' from arguments
    // 2. If password not modified, just return. 
    // The promise resolves automatically.
    if (!this.isModified('password')){
       return; 
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // 3. No need to call next(). The function ending IS the 'next'.
    } catch (err) {
        // 4. If you throw an error here, Mongoose catches it and aborts save.
        throw err; 
    }
});
// Compare Password method
userSchema.methods.matchPassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User