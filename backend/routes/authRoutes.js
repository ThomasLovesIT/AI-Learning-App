import express from 'express'
import {body} from 'express-validator'
import 
{login,
 register,
 getProfile,
 updateProfile,
 changePassword
} from '../controllers/authController.js'
import protect from '../middleware/auth.js'
import {registerValidation,loginValidation} from '../validator/authValidator.js'


const router = express.Router()

//Public Routes
router.post('/login',loginValidation, login )
router.post('/register',registerValidation, register )

//Protected Routes
router.get('/profile',protect, getProfile )
router.put('/profile',protect, updateProfile )
router.post('/change-password',protect, changePassword )

export default router