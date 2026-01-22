import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

// generate jwt token
const generateToken = (id) => {
 if (!process.env.JWT_SECRET){
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill out all fields' });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
        message: 'Success login'
      },
    });

  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      error: error.message
    })
 
  }
}


// ============================
// GET PROFILE
// ============================
export async function getProfile(req, res, next) {
  try {

    const user = await User.findById(req.user._id) // Added User.

    res.status(200).json({
      success:true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    })


  } catch (err) {
    next(err)
  }
}



// ============================
// UPDATE PROFILE
// ============================
export async function updateProfile(req, res, next) {
  try {

    const {username, email, profileImage} =  req.body;

    if(!username||!email||!profileImage){
      return res.status(400).json({message: 'Please fill out the fields'})
    }

    const user = await User.findById(req.user._id) // Added User.

    if(username) user.username = username;
    if(email) user.email = email;
    if(profileImage) user.profileImage = profileImage;
    
    await user.save()
    res.status(200).json({ 
      message: 'Success' ,
    data: {
      id: user._id,
       username: user.username,
        email: user.email,
        profileImage: user.profileImage,
    }})
  } catch (err) {
    next(err)
  }
}

// ============================
// CHANGE PASSWORD
// ============================
export async function changePassword(req, res, next) {
  try {

   const {currentPassword, newPassword} = req.body

   if(!currentPassword || !newPassword){
    return res.status(400).json({message: 'Password cannot be empty'})
   }

   const user = await User.findById(req.user._id).select('+password')
   const isMatch = await bcrypt.compare(currentPassword, user.password)

   if(!isMatch) {
      return res.status(400).json({message: 'Current password is incorrect'})
   }

   user.password = newPassword
   await user.save()

      res.status(200).json({
      message:'Password changed successfully',
      success: true
    })

  } catch (err) {
    next(err)
  }
}