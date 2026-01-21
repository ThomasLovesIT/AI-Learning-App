import { body } from 'express-validator';



export const registerValidation = [
    body('username')
    .trim()
    .isLength({ min: 3})
    .withMessage('Username must be at least 3 characters'),
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Provide a valid email'),
    body('password')
    .isLength({min:6})
    .withMessage('Passwords must be atleast 6 letters')
    
]
export const loginValidation = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Provide a valid email'),
    body('password')
    .notEmpty()
    .withMessage('Invalid password')
    
]
