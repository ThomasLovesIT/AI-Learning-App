import express from 'express'
import protect from '../middleware/auth.js'
import {} from '../controllers/quizController'

const router = express.Router()
router.use(protect)

router.get('/')