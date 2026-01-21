import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

// generate jwt token
const generateToken = (id) => {
  if (!process.env.JWT_EXPIRE){
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '3d',
  })
}

// ============================
// REGISTER
// ============================
export async function register(req, res, next) {
    try {
        const { username, email, password } = req.body;

        // 1. Validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }

        // 2. Check existence
        const userExist = await User.exists({ email });

        if (userExist) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // 3. Create User 
        const newUser = await User.create({
            username,
            email,
            password, // Passing plain text
        });

        // 4. Generate Token
        const token = generateToken(newUser._id);

        // 5. Response
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                   
                },
                token,
            },
        });

    } catch (err) {
        // ERROR HANDLING FIX
        // If 'next' is defined (Express), use it. 
        // If not (maybe Next.js or bad testing), log and return 500.
        
            next(err);
       
    }
}
// ============================
// LOGIN (stub – ready)
// ============================
export async function login(req, res, next) {
  try {
    res.status(501).json({ message: 'Login not implemented yet' })
  } catch (err) {
    next(err)
  }
}

// ============================
// GET PROFILE
// ============================
export async function getProfile(req, res, next) {
  try {
    res.status(501).json({ message: 'Get profile not implemented yet' })
  } catch (err) {
    next(err)
  }
}

// ============================
// UPDATE PROFILE
// ============================
export async function updateProfile(req, res, next) {
  try {
    res.status(501).json({ message: 'Update profile not implemented yet' })
  } catch (err) {
    next(err)
  }
}

// ============================
// CHANGE PASSWORD
// ============================
export async function changePassword(req, res, next) {
  try {
    res.status(501).json({ message: 'Change password not implemented yet' })
  } catch (err) {
    next(err)
  }
}
