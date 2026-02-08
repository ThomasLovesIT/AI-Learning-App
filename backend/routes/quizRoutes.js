import express from 'express'
import protect from '../middleware/auth.js'
import {getQuizzes,
        getQuizById,
        submitQuiz,
        getQuizResults,
        deleteQuiz
} from '../controllers/quizController.js'

const router = express.Router()
router.use(protect)

router.get('/', getQuizzes) 
router.get('/:id', getQuizById) 
router.post('/', submitQuiz) 
router.get('/:id/results', getQuizResults) 
router.get('/', deleteQuiz) 

export default router