import express from 'express'
import protect from '../middleware/auth.js'
import {getQuiz} from '../controllers/quizController.js'

const router = express.Router()
router.use(protect)

router.get('/', getQuiz) 

export default router